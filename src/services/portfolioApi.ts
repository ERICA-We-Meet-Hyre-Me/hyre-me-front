import {
  ApiClient,
  ApiError,
  PortfolioCertificationCreateRequest,
  PortfolioCertificationResponse,
  PortfolioCertificationUpdateRequest,
  PortfolioExperienceCreateRequest,
  PortfolioExperienceResponse,
  PortfolioExperienceUpdateRequest,
  PortfolioLanguageCreateRequest,
  PortfolioLanguageResponse,
  PortfolioLanguageUpdateRequest,
  PortfolioProfileResponse,
  PortfolioProfileUpsertRequest,
  PortfolioSaveRequest,
  PortfolioSaveResponse,
} from './apiClient';

export function createPortfolioApi(client: ApiClient) {
  const authJson = { auth: true, json: true };
  const authNoJson = { auth: true, json: false };

  return {
    async getPortfolioProfile(): Promise<PortfolioProfileResponse | null> {
      try {
        return await client.request<PortfolioProfileResponse>('/api/portfolio/profile', {
          method: 'GET',
        }, authNoJson);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }

        throw error;
      }
    },

    async upsertPortfolioProfile(data: PortfolioProfileUpsertRequest): Promise<PortfolioProfileResponse> {
      return client.request<PortfolioProfileResponse>('/api/portfolio/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }, authJson);
    },

    async uploadResumeFile(resumeFile: File): Promise<PortfolioProfileResponse> {
      const formData = new FormData();
      formData.append('resume_file', resumeFile);

      return client.request<PortfolioProfileResponse>('/api/portfolio/profile/resume-upload', {
        method: 'POST',
        body: formData,
      }, authNoJson);
    },

    async listPortfolioExperiences(): Promise<PortfolioExperienceResponse[]> {
      return client.request<PortfolioExperienceResponse[]>('/api/portfolio/experiences', {
        method: 'GET',
      }, authNoJson);
    },

    async getPortfolioExperience(experienceId: number): Promise<PortfolioExperienceResponse> {
      return client.request<PortfolioExperienceResponse>(`/api/portfolio/experiences/${experienceId}`, {
        method: 'GET',
      }, authNoJson);
    },

    async createPortfolioExperience(data: PortfolioExperienceCreateRequest): Promise<PortfolioExperienceResponse> {
      return client.request<PortfolioExperienceResponse>('/api/portfolio/experiences', {
        method: 'POST',
        body: JSON.stringify(data),
      }, authJson);
    },

    async updatePortfolioExperience(experienceId: number, data: PortfolioExperienceUpdateRequest): Promise<PortfolioExperienceResponse> {
      return client.request<PortfolioExperienceResponse>(`/api/portfolio/experiences/${experienceId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }, authJson);
    },

    async deletePortfolioExperience(experienceId: number): Promise<void> {
      return client.requestNoContent(`/api/portfolio/experiences/${experienceId}`, {
        method: 'DELETE',
      }, authNoJson);
    },

    async listPortfolioCertifications(): Promise<PortfolioCertificationResponse[]> {
      return client.request<PortfolioCertificationResponse[]>('/api/portfolio/certifications', {
        method: 'GET',
      }, authNoJson);
    },

    async getPortfolioCertification(certificationId: number): Promise<PortfolioCertificationResponse> {
      return client.request<PortfolioCertificationResponse>(`/api/portfolio/certifications/${certificationId}`, {
        method: 'GET',
      }, authNoJson);
    },

    async createPortfolioCertification(data: PortfolioCertificationCreateRequest): Promise<PortfolioCertificationResponse> {
      return client.request<PortfolioCertificationResponse>('/api/portfolio/certifications', {
        method: 'POST',
        body: JSON.stringify(data),
      }, authJson);
    },

    async updatePortfolioCertification(certificationId: number, data: PortfolioCertificationUpdateRequest): Promise<PortfolioCertificationResponse> {
      return client.request<PortfolioCertificationResponse>(`/api/portfolio/certifications/${certificationId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }, authJson);
    },

    async deletePortfolioCertification(certificationId: number): Promise<void> {
      return client.requestNoContent(`/api/portfolio/certifications/${certificationId}`, {
        method: 'DELETE',
      }, authNoJson);
    },

    async listPortfolioLanguages(): Promise<PortfolioLanguageResponse[]> {
      return client.request<PortfolioLanguageResponse[]>('/api/portfolio/languages', {
        method: 'GET',
      }, authNoJson);
    },

    async getPortfolioLanguage(languageId: number): Promise<PortfolioLanguageResponse> {
      return client.request<PortfolioLanguageResponse>(`/api/portfolio/languages/${languageId}`, {
        method: 'GET',
      }, authNoJson);
    },

    async createPortfolioLanguage(data: PortfolioLanguageCreateRequest): Promise<PortfolioLanguageResponse> {
      return client.request<PortfolioLanguageResponse>('/api/portfolio/languages', {
        method: 'POST',
        body: JSON.stringify(data),
      }, authJson);
    },

    async updatePortfolioLanguage(languageId: number, data: PortfolioLanguageUpdateRequest): Promise<PortfolioLanguageResponse> {
      return client.request<PortfolioLanguageResponse>(`/api/portfolio/languages/${languageId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }, authJson);
    },

    async deletePortfolioLanguage(languageId: number): Promise<void> {
      return client.requestNoContent(`/api/portfolio/languages/${languageId}`, {
        method: 'DELETE',
      }, authNoJson);
    },

    async saveFullPortfolio(data: PortfolioSaveRequest): Promise<PortfolioSaveResponse> {
      return client.request<PortfolioSaveResponse>('/api/portfolio', {
        method: 'PUT',
        body: JSON.stringify(data),
      }, authJson);
    },
  };
}