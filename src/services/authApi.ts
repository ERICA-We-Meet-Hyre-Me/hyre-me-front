import { ApiClient, TokenResponse, UserCreateRequest, UserLoginRequest, UserResponse, UserUpdateRequest } from './apiClient';

export function createAuthApi(client: ApiClient) {
  return {
    setAuthFailureHandler: client.setAuthFailureHandler.bind(client),
    hasStoredSession: client.hasStoredSession.bind(client),
    storeTokens: client.storeTokens.bind(client),
    logout: client.logout.bind(client),

    async register(data: UserCreateRequest): Promise<UserResponse> {
      return client.request<UserResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }, {
        auth: false,
        json: true,
        retryOnUnauthorized: false,
      });
    },

    async login(data: UserLoginRequest): Promise<TokenResponse> {
      return client.request<TokenResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }, {
        auth: false,
        json: true,
        retryOnUnauthorized: false,
      });
    },

    async getCurrentUser(): Promise<UserResponse> {
      return client.request<UserResponse>('/api/auth/me', {
        method: 'GET',
      }, {
        auth: true,
        json: false,
      });
    },

    async updateCurrentUser(data: UserUpdateRequest): Promise<UserResponse> {
      return client.request<UserResponse>('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }, {
        auth: true,
        json: true,
      });
    },
  };
}