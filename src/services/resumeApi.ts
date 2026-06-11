import { ApiClient, GeneratedResumeResponse, GeneratedResumeStatusResponse, ResumeCompanyOption, GenerateResumeRequest } from './apiClient';

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
  };
}