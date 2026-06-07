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

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  name: string;
}

class ApiService {
  private getAuthHeader() {
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
    const token = localStorage.getItem('access_token');
    
    console.log('🔐 Authorization 요청:');
    console.log('- Token:', token?.substring(0, 20) + '...');
    console.log('- Headers:', headers);
    
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 사용자 정보 조회 실패:');
      console.error('- Status:', response.status);
      console.error('- Status Text:', response.statusText);
      console.error('- Response:', errorText);
      throw new Error(`사용자 정보를 불러올 수 없습니다. (${response.status} ${response.statusText})`);
    }

    return response.json();
  }

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
  }
}

export const apiService = new ApiService();
