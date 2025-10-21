import type { SignupData, LoginData, AuthResponse, Merchant } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${API_BASE_URL}${endpoint}`;
		
		const response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			credentials: 'include', // Important: include cookies
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'An error occurred' }));
			throw new Error(error.error || `HTTP ${response.status}`);
		}

		return response.json();
	}

	async signup(data: SignupData): Promise<AuthResponse> {
		return this.request<AuthResponse>('/api/merchants/signup', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async login(data: LoginData): Promise<AuthResponse> {
		return this.request<AuthResponse>('/api/merchants/login', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async logout(): Promise<{ message: string }> {
		return this.request<{ message: string }>('/api/merchants/logout', {
			method: 'POST',
		});
	}

	async getMe(): Promise<Merchant> {
		return this.request<Merchant>('/api/merchants/me');
	}
}

export const api = new ApiClient();
