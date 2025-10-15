export interface Merchant {
	id: string;
	name: string;
	email: string;
	webhookUrl: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface SignupData {
	name: string;
	email: string;
	password: string;
	webhookUrl?: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface AuthResponse {
	merchant: Merchant;
}

export interface ApiError {
	error: string;
}
