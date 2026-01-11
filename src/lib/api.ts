const API_URLS = {
  auth: 'https://functions.poehali.dev/5512c5dc-3884-4e6f-8134-523b8bd7b0e2',
};

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export const api = {
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register',
        username,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка регистрации');
    }

    return response.json();
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        username,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка авторизации');
    }

    return response.json();
  },
};

export const auth = {
  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  saveUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};
