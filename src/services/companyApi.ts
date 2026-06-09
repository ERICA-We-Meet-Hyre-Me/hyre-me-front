import { ApiClient, CompanyCreateRequest, CompanyResponse, CompanyUpdateRequest } from './apiClient';

export function createCompanyApi(client: ApiClient) {
  const authJson = { auth: true, json: true };
  const authNoJson = { auth: true, json: false };

  return {
    async listCompanies(): Promise<CompanyResponse[]> {
      return client.request<CompanyResponse[]>('/api/companies', {
        method: 'GET',
      }, authNoJson);
    },

    async getCompany(companyId: number): Promise<CompanyResponse> {
      return client.request<CompanyResponse>(`/api/companies/${companyId}`, {
        method: 'GET',
      }, authNoJson);
    },

    async createCompany(data: CompanyCreateRequest): Promise<CompanyResponse> {
      return client.request<CompanyResponse>('/api/companies', {
        method: 'POST',
        body: JSON.stringify(data),
      }, authJson);
    },

    async updateCompany(companyId: number, data: CompanyUpdateRequest): Promise<CompanyResponse> {
      return client.request<CompanyResponse>(`/api/companies/${companyId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }, authJson);
    },

    async deleteCompany(companyId: number): Promise<void> {
      return client.requestNoContent(`/api/companies/${companyId}`, {
        method: 'DELETE',
      }, authNoJson);
    },
  };
}