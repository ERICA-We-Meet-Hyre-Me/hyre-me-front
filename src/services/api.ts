const API_URL = import.meta.env.VITE_API_URL;

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

class ApiService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  async register(data: UserCreateRequest): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.[0]?.msg || '회원가입에 실패했습니다.');
    }

    return response.json();
  }

  async login(data: UserLoginRequest): Promise<TokenResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.[0]?.msg || '로그인에 실패했습니다.');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<UserResponse> {
    const headers = this.getAuthHeader();
    
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`사용자 정보를 불러올 수 없습니다. (${response.status} ${response.statusText})`);
    }

    return response.json();
  }

  async updateCurrentUser(data: UserUpdateRequest): Promise<UserResponse> {
    const headers = this.getAuthHeader();
    const body = JSON.stringify(data);
    const endpoints = [`${API_URL}/me`, `${API_URL}/users/me`];
    let lastError: unknown = null;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'PATCH',
          headers,
          body,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `요청에 실패했습니다. (${response.status})`);
        }

        const text = await response.text();
        if (!text) {
          return this.getCurrentUser();
        }

        return JSON.parse(text) as UserResponse;
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError instanceof Error ? lastError : new Error('사용자 정보를 저장할 수 없습니다.');
  }

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
  }
}

export const apiService = new ApiService();
