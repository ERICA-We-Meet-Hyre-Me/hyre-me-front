const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  created_at: string | null;
}

export interface UserUpdateRequest {
  name?: string;
  password?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id: number;
  name: string;
}

export interface PortfolioProfileResponse {
  education: string | null;
  gpa: string | null;
  core_skills_text: string | null;
  self_intro_keywords: string | null;
  id: number;
  user_id: number;
  resume_file_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PortfolioProfileUpsertRequest {
  education?: string | null;
  gpa?: string | null;
  core_skills_text?: string | null;
  self_intro_keywords?: string | null;
}

export interface PortfolioExperienceCreateRequest {
  category: string;
  title: string;
  organization?: string | null;
  period_text?: string | null;
  role?: string | null;
  tech_stack?: string | null;
  description?: string | null;
  achievement?: string | null;
  learned?: string | null;
  related_skills?: string | null;
  sort_order?: number | null;
}

export interface PortfolioExperienceUpdateRequest {
  category?: string | null;
  title?: string | null;
  organization?: string | null;
  period_text?: string | null;
  role?: string | null;
  tech_stack?: string | null;
  description?: string | null;
  achievement?: string | null;
  learned?: string | null;
  related_skills?: string | null;
  sort_order?: number | null;
}

export interface PortfolioExperienceResponse extends Required<Pick<PortfolioExperienceCreateRequest, 'category' | 'title'>> {
  organization: string | null;
  period_text: string | null;
  role: string | null;
  tech_stack: string | null;
  description: string | null;
  achievement: string | null;
  learned: string | null;
  related_skills: string | null;
  sort_order: number | null;
  id: number;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface PortfolioCertificationCreateRequest {
  name: string;
  issuer?: string | null;
  acquired_date?: string | null;
  description?: string | null;
}

export interface PortfolioCertificationUpdateRequest {
  name?: string | null;
  issuer?: string | null;
  acquired_date?: string | null;
  description?: string | null;
}

export interface PortfolioCertificationResponse extends Required<Pick<PortfolioCertificationCreateRequest, 'name'>> {
  issuer: string | null;
  acquired_date: string | null;
  description: string | null;
  id: number;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface PortfolioLanguageCreateRequest {
  test_name: string;
  score?: string | null;
  grade?: string | null;
  acquired_date?: string | null;
  description?: string | null;
}

export interface PortfolioLanguageUpdateRequest {
  test_name?: string | null;
  score?: string | null;
  grade?: string | null;
  acquired_date?: string | null;
  description?: string | null;
}

export interface PortfolioLanguageResponse extends Required<Pick<PortfolioLanguageCreateRequest, 'test_name'>> {
  score: string | null;
  grade: string | null;
  acquired_date: string | null;
  description: string | null;
  id: number;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface PortfolioSaveRequest {
  profile: PortfolioProfileUpsertRequest;
  experiences: PortfolioExperienceCreateRequest[];
  certifications: PortfolioCertificationCreateRequest[];
  languages: PortfolioLanguageCreateRequest[];
}

export interface PortfolioSaveResponse {
  profile: PortfolioProfileResponse;
  experiences: PortfolioExperienceResponse[];
  certifications: PortfolioCertificationResponse[];
  languages: PortfolioLanguageResponse[];
}

export interface CompanyCreateRequest {
  name: string;
  role: string;
  deadline_text?: string | null;
  status?: string | null;
  job_posting_url?: string | null;
  requirements?: string | null;
  preferences?: string | null;
  core_values?: string | null;
}

export interface CompanyUpdateRequest {
  name?: string | null;
  role?: string | null;
  deadline_text?: string | null;
  status?: string | null;
  job_posting_url?: string | null;
  requirements?: string | null;
  preferences?: string | null;
  core_values?: string | null;
}

export interface CompanyResponse extends Required<Pick<CompanyCreateRequest, 'name' | 'role'>> {
  deadline_text: string | null;
  status: string | null;
  job_posting_url: string | null;
  requirements: string | null;
  preferences: string | null;
  core_values: string | null;
  id: number;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface GeneratedResumeResponse {
  id: number;
  user_id: number;
  company_id: number;
  title: string;
  additional_prompt: string | null;
  content_markdown: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface GeneratedResumeStatusResponse {
  id: number;
  status: string | null;
}

export interface ResumeCompanyOption {
  id: number;
  name: string;
  role: string;
  status: string | null;
  deadline_text: string | null;
}

export interface GenerateResumeRequest {
  company_id: number;
  additional_prompt?: string | null;
  language?: string;
}

interface ApiErrorPayload {
  detail?: JsonValue;
  message?: string;
  error?: string;
}

export interface ApiRequestConfig {
  auth?: boolean;
  json?: boolean;
  retryOnUnauthorized?: boolean;
}

export class ApiError extends Error {
  status: number;
  payload?: JsonValue;

  constructor(message: string, status: number, payload?: JsonValue) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path: string) {
  return `${API_URL}${path}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractMessage(value: JsonValue | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((item) => extractMessage(item as JsonValue))
      .filter((item): item is string => Boolean(item));
    return messages.length > 0 ? messages.join(', ') : null;
  }

  if (isRecord(value)) {
    if (typeof value.msg === 'string') {
      return value.msg;
    }

    if (typeof value.message === 'string') {
      return value.message;
    }

    if (Array.isArray(value.detail)) {
      return extractMessage(value.detail as JsonValue);
    }

    if (typeof value.error === 'string') {
      return value.error;
    }
  }

  return null;
}

async function readResponseBody(response: Response): Promise<JsonValue | undefined> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return JSON.parse(text) as JsonValue;
  }

  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    return text;
  }
}

export class ApiClient {
  private authFailureHandler: (() => void) | null = null;

  private refreshPromise: Promise<boolean> | null = null;

  setAuthFailureHandler(handler: (() => void) | null) {
    this.authFailureHandler = handler;
  }

  private getAccessToken() {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  hasStoredSession() {
    return Boolean(this.getAccessToken() || this.getRefreshToken());
  }

  storeTokens(tokens: { access_token: string; refresh_token: string }) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  logout() {
    this.clearTokens();
  }

  private notifyAuthFailure() {
    this.clearTokens();
    this.authFailureHandler?.();
  }

  private buildHeaders(options: RequestInit, config: ApiRequestConfig) {
    const headers = new Headers(options.headers ?? {});

    if (config.auth !== false) {
      const token = this.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    if (config.json !== false && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  private async refreshTokens(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      try {
        const response = await fetch(buildUrl('/api/auth/refresh'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
          return false;
        }

        const body = await readResponseBody(response);
        if (!isRecord(body)) {
          return false;
        }

        if (typeof body.access_token !== 'string' || typeof body.refresh_token !== 'string') {
          return false;
        }

        this.storeTokens({
          access_token: body.access_token,
          refresh_token: body.refresh_token,
        });

        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  async request<T>(
    path: string,
    options: RequestInit = {},
    config: ApiRequestConfig = {},
  ): Promise<T> {
    const response = await fetch(buildUrl(path), {
      ...options,
      headers: this.buildHeaders(options, config),
    });
    const body = await readResponseBody(response);

    if (!response.ok) {
      const shouldRetryOnUnauthorized = config.retryOnUnauthorized !== false;

      if (response.status === 401 && shouldRetryOnUnauthorized) {
        const refreshed = await this.refreshTokens();
        if (refreshed) {
          return this.request<T>(path, options, {
            ...config,
            retryOnUnauthorized: false,
          });
        }

        this.notifyAuthFailure();
      }

      const payload = isRecord(body) ? (body as ApiErrorPayload) : undefined;
      const message =
        extractMessage(payload?.detail as JsonValue | undefined) ||
        extractMessage(body) ||
        payload?.message ||
        payload?.error ||
        `요청에 실패했습니다. (${response.status})`;
      throw new ApiError(message, response.status, body);
    }

    return body as T;
  }

  async requestNoContent(
    path: string,
    options: RequestInit = {},
    config: ApiRequestConfig = {},
  ): Promise<void> {
    await this.request<void>(path, options, config);
  }
}

export const apiClient = new ApiClient();