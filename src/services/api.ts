const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

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

interface ApiErrorPayload {
  detail?: JsonValue;
  message?: string;
  error?: string;
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

class ApiService {
  private getAuthHeaders(json = true): Record<string, string> {
    const token = localStorage.getItem('access_token');
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (json) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(buildUrl(path), options);
    const body = await readResponseBody(response);

    if (!response.ok) {
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

  private async requestNoContent(path: string, options: RequestInit = {}): Promise<void> {
    const response = await fetch(buildUrl(path), options);
    const body = await readResponseBody(response);

    if (!response.ok) {
      const payload = isRecord(body) ? (body as ApiErrorPayload) : undefined;
      const message =
        extractMessage(payload?.detail as JsonValue | undefined) ||
        extractMessage(body) ||
        payload?.message ||
        payload?.error ||
        `요청에 실패했습니다. (${response.status})`;
      throw new ApiError(message, response.status, body);
    }
  }

  async register(data: UserCreateRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/register', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async login(data: UserLoginRequest): Promise<TokenResponse> {
    return this.request<TokenResponse>('/login', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/me', {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async updateCurrentUser(data: UserUpdateRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/me', {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
  }

  async getPortfolioProfile(): Promise<PortfolioProfileResponse | null> {
    try {
      return await this.request<PortfolioProfileResponse>('/api/portfolio/profile', {
        method: 'GET',
        headers: this.getAuthHeaders(false),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  }

  async upsertPortfolioProfile(data: PortfolioProfileUpsertRequest): Promise<PortfolioProfileResponse> {
    return this.request<PortfolioProfileResponse>('/api/portfolio/profile', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async uploadResumeFile(resumeFile: File): Promise<PortfolioProfileResponse> {
    const formData = new FormData();
    formData.append('resume_file', resumeFile);

    return this.request<PortfolioProfileResponse>('/api/portfolio/profile/resume-upload', {
      method: 'POST',
      headers: this.getAuthHeaders(false),
      body: formData,
    });
  }

  async listPortfolioExperiences(): Promise<PortfolioExperienceResponse[]> {
    return this.request<PortfolioExperienceResponse[]>('/api/portfolio/experiences', {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async getPortfolioExperience(experienceId: number): Promise<PortfolioExperienceResponse> {
    return this.request<PortfolioExperienceResponse>(`/api/portfolio/experiences/${experienceId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async createPortfolioExperience(data: PortfolioExperienceCreateRequest): Promise<PortfolioExperienceResponse> {
    return this.request<PortfolioExperienceResponse>('/api/portfolio/experiences', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async updatePortfolioExperience(experienceId: number, data: PortfolioExperienceUpdateRequest): Promise<PortfolioExperienceResponse> {
    return this.request<PortfolioExperienceResponse>(`/api/portfolio/experiences/${experienceId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async deletePortfolioExperience(experienceId: number): Promise<void> {
    return this.requestNoContent(`/api/portfolio/experiences/${experienceId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(false),
    });
  }

  async listPortfolioCertifications(): Promise<PortfolioCertificationResponse[]> {
    return this.request<PortfolioCertificationResponse[]>('/api/portfolio/certifications', {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async getPortfolioCertification(certificationId: number): Promise<PortfolioCertificationResponse> {
    return this.request<PortfolioCertificationResponse>(`/api/portfolio/certifications/${certificationId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async createPortfolioCertification(data: PortfolioCertificationCreateRequest): Promise<PortfolioCertificationResponse> {
    return this.request<PortfolioCertificationResponse>('/api/portfolio/certifications', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async updatePortfolioCertification(certificationId: number, data: PortfolioCertificationUpdateRequest): Promise<PortfolioCertificationResponse> {
    return this.request<PortfolioCertificationResponse>(`/api/portfolio/certifications/${certificationId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async deletePortfolioCertification(certificationId: number): Promise<void> {
    return this.requestNoContent(`/api/portfolio/certifications/${certificationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(false),
    });
  }

  async listPortfolioLanguages(): Promise<PortfolioLanguageResponse[]> {
    return this.request<PortfolioLanguageResponse[]>('/api/portfolio/languages', {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async getPortfolioLanguage(languageId: number): Promise<PortfolioLanguageResponse> {
    return this.request<PortfolioLanguageResponse>(`/api/portfolio/languages/${languageId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async createPortfolioLanguage(data: PortfolioLanguageCreateRequest): Promise<PortfolioLanguageResponse> {
    return this.request<PortfolioLanguageResponse>('/api/portfolio/languages', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async updatePortfolioLanguage(languageId: number, data: PortfolioLanguageUpdateRequest): Promise<PortfolioLanguageResponse> {
    return this.request<PortfolioLanguageResponse>(`/api/portfolio/languages/${languageId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async deletePortfolioLanguage(languageId: number): Promise<void> {
    return this.requestNoContent(`/api/portfolio/languages/${languageId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(false),
    });
  }

  async saveFullPortfolio(data: PortfolioSaveRequest): Promise<PortfolioSaveResponse> {
    return this.request<PortfolioSaveResponse>('/api/portfolio', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async listCompanies(): Promise<CompanyResponse[]> {
    return this.request<CompanyResponse[]>('/api/companies', {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async getCompany(companyId: number): Promise<CompanyResponse> {
    return this.request<CompanyResponse>(`/api/companies/${companyId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async createCompany(data: CompanyCreateRequest): Promise<CompanyResponse> {
    return this.request<CompanyResponse>('/api/companies', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async updateCompany(companyId: number, data: CompanyUpdateRequest): Promise<CompanyResponse> {
    return this.request<CompanyResponse>(`/api/companies/${companyId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  async deleteCompany(companyId: number): Promise<void> {
    return this.requestNoContent(`/api/companies/${companyId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(false),
    });
  }

  async listResumeCompanies(): Promise<ResumeCompanyOption[]> {
    return this.request<ResumeCompanyOption[]>('/api/resumes/companies', {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async listGeneratedResumes(): Promise<GeneratedResumeResponse[]> {
    return this.request<GeneratedResumeResponse[]>('/api/resumes', {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async getGeneratedResume(resumeId: number): Promise<GeneratedResumeResponse> {
    return this.request<GeneratedResumeResponse>(`/api/resumes/${resumeId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async getGeneratedResumeStatus(resumeId: number): Promise<GeneratedResumeStatusResponse> {
    return this.request<GeneratedResumeStatusResponse>(`/api/resumes/${resumeId}/status`, {
      method: 'GET',
      headers: this.getAuthHeaders(false),
    });
  }

  async deleteGeneratedResume(resumeId: number): Promise<void> {
    return this.requestNoContent(`/api/resumes/${resumeId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(false),
    });
  }
}

export const apiService = new ApiService();
