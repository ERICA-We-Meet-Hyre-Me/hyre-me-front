import { apiClient } from './apiClient';
import { createAuthApi } from './authApi';
import { createCompanyApi } from './companyApi';
import { createPortfolioApi } from './portfolioApi';
import { createResumeApi } from './resumeApi';

export * from './apiClient';

export const apiService = {
  ...createAuthApi(apiClient),
  ...createPortfolioApi(apiClient),
  ...createCompanyApi(apiClient),
  ...createResumeApi(apiClient),
};