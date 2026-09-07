import {
  ApiClient,
  GeneratedResumeResponse,
  GeneratedResumeStatusResponse,
  GenerateResumeRequest,
  ResumeCompanyOption,
} from './apiClient';

export interface ResumeGenerationStatusEvent {
  stage?: string;
  status?: string;
}

export interface ResumeGenerationContentEvent {
  sequence?: number;
  delta: string;
  replace?: boolean;
}

export interface ResumeGenerationCompleteEvent {
  status?: string;
  resume: GeneratedResumeResponse;
}

export interface ResumeGenerationErrorEvent {
  message: string;
}

export type ResumeGenerationStreamEvent =
  | { type: 'status'; data: ResumeGenerationStatusEvent }
  | { type: 'content'; data: ResumeGenerationContentEvent }
  | { type: 'complete'; data: ResumeGenerationCompleteEvent }
  | { type: 'error'; data: ResumeGenerationErrorEvent };

export type ResumeGenerationStreamEventHandler = (event: ResumeGenerationStreamEvent) => void;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseEventPayload(data: string): unknown {
  try {
    return JSON.parse(data) as unknown;
  } catch {
    throw new Error('자소서 생성 스트림의 응답을 해석하지 못했습니다.');
  }
}

function getErrorMessage(payload: unknown): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (isRecord(payload)) {
    for (const key of ['message', 'error', 'detail']) {
      const value = payload[key];
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }
  }

  return 'AI 자소서 생성 중 오류가 발생했습니다.';
}

function parseStreamEvent(eventName: string, data: string): ResumeGenerationStreamEvent | null {
  if (!data) {
    return null;
  }

  const payload = parseEventPayload(data);
  const eventType = eventName || 'message';

  if (eventType === 'status') {
    const status = isRecord(payload) ? payload : {};
    return {
      type: 'status',
      data: {
        stage: typeof status.stage === 'string' ? status.stage : undefined,
        status: typeof status.status === 'string' ? status.status : undefined,
      },
    };
  }

  if (eventType === 'content') {
    if (!isRecord(payload) || typeof payload.delta !== 'string') {
      throw new Error('자소서 본문 스트림의 형식이 올바르지 않습니다.');
    }

    return {
      type: 'content',
      data: {
        sequence: typeof payload.sequence === 'number' ? payload.sequence : undefined,
        delta: payload.delta,
        replace: payload.replace === true,
      },
    };
  }

  if (eventType === 'complete') {
    if (!isRecord(payload) || !isRecord(payload.resume) || typeof payload.resume.id !== 'number') {
      throw new Error('자소서 생성 완료 응답의 형식이 올바르지 않습니다.');
    }

    return {
      type: 'complete',
      data: {
        status: typeof payload.status === 'string' ? payload.status : undefined,
        resume: payload.resume as unknown as GeneratedResumeResponse,
      },
    };
  }

  if (eventType === 'error') {
    return {
      type: 'error',
      data: { message: getErrorMessage(payload) },
    };
  }

  return null;
}

export function createResumeApi(client: ApiClient) {
  const authNoJson = { auth: true, json: false };

  return {
    async listResumeCompanies(): Promise<ResumeCompanyOption[]> {
      return client.request<ResumeCompanyOption[]>('/api/resumes/companies', {
        method: 'GET',
      }, authNoJson);
    },

    async listGeneratedResumes(): Promise<GeneratedResumeResponse[]> {
      return client.request<GeneratedResumeResponse[]>('/api/resumes', {
        method: 'GET',
      }, authNoJson);
    },

    async getGeneratedResume(resumeId: number): Promise<GeneratedResumeResponse> {
      return client.request<GeneratedResumeResponse>(`/api/resumes/${resumeId}`, {
        method: 'GET',
      }, authNoJson);
    },

    async getGeneratedResumeStatus(resumeId: number): Promise<GeneratedResumeStatusResponse> {
      return client.request<GeneratedResumeStatusResponse>(`/api/resumes/${resumeId}/status`, {
        method: 'GET',
      }, authNoJson);
    },

    async deleteGeneratedResume(resumeId: number): Promise<void> {
      return client.requestNoContent(`/api/resumes/${resumeId}`, {
        method: 'DELETE',
      }, authNoJson);
    },

    async generateResume(payload: GenerateResumeRequest): Promise<GeneratedResumeResponse> {
      return client.request<GeneratedResumeResponse>('/api/resumes/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      }, { auth: true });
    },

    async generateResumeStream(
      payload: GenerateResumeRequest,
      onEvent: ResumeGenerationStreamEventHandler,
      signal?: AbortSignal,
    ): Promise<GeneratedResumeResponse> {
      const response = await client.requestStream('/api/resumes/generate/stream', {
        method: 'POST',
        body: JSON.stringify(payload),
        signal,
      }, { auth: true });

      if (!response.body) {
        throw new Error('자소서 생성 스트림을 시작하지 못했습니다.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let eventName = '';
      let dataLines: string[] = [];
      let completedResume: GeneratedResumeResponse | null = null;

      const dispatchEvent = () => {
        if (dataLines.length === 0) {
          eventName = '';
          return;
        }

        const event = parseStreamEvent(eventName, dataLines.join('\n'));
        eventName = '';
        dataLines = [];

        if (!event) {
          return;
        }

        onEvent(event);
        if (event.type === 'error') {
          throw new Error(event.data.message);
        }
        if (event.type === 'complete') {
          completedResume = event.data.resume;
        }
      };

      const processLine = (line: string) => {
        if (line === '') {
          dispatchEvent();
          return;
        }

        if (line.startsWith(':')) {
          return;
        }

        const separatorIndex = line.indexOf(':');
        const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
        const rawValue = separatorIndex === -1 ? '' : line.slice(separatorIndex + 1);
        const value = rawValue.startsWith(' ') ? rawValue.slice(1) : rawValue;

        if (field === 'event') {
          eventName = value;
        } else if (field === 'data') {
          dataLines.push(value);
        }
      };

      const processAvailableLines = () => {
        while (true) {
          const newlineIndex = buffer.search(/[\r\n]/);
          if (newlineIndex === -1) {
            return;
          }

          const lineEnding = buffer[newlineIndex];
          if (lineEnding === '\r' && newlineIndex === buffer.length - 1) {
            return;
          }

          const line = buffer.slice(0, newlineIndex);
          const endingLength = lineEnding === '\r' && buffer[newlineIndex + 1] === '\n' ? 2 : 1;
          buffer = buffer.slice(newlineIndex + endingLength);
          processLine(line);

          if (completedResume) {
            return;
          }
        }
      };

      try {
        while (!completedResume) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          processAvailableLines();
        }

        buffer += decoder.decode();
        processAvailableLines();

        if (!completedResume && buffer) {
          const finalLine = buffer.endsWith('\r') ? buffer.slice(0, -1) : buffer;
          if (finalLine) {
            processLine(finalLine);
          }
          buffer = '';
          dispatchEvent();
        }

        if (!completedResume) {
          throw new Error('자소서 생성 스트림이 완료되기 전에 종료되었습니다.');
        }

        return completedResume;
      } finally {
        reader.releaseLock();
      }
    },
  };
}
