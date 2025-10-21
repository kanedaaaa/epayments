import type { RequestEvent } from '@sveltejs/kit';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

interface Merchant {
	id: string;
	name: string;
	email: string;
	isActive: boolean;
}

export const load = async ({ cookies }: RequestEvent) => {
	const accessToken = cookies.get('accessToken');

	if (!accessToken) {
		return {
			user: null
		};
	}

	try {
		const response = await fetch(`${API_BASE_URL}/api/merchants/me`, {
			headers: {
				Cookie: `accessToken=${accessToken}`,
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		if (!response.ok) {
			// Token is invalid, clear it
			cookies.delete('accessToken', { path: '/' });
			return {
				user: null
			};
		}

		const merchant = (await response.json()) as Merchant;

		return {
			user: merchant
		};
	} catch (error) {
		return {
			user: null
		};
	}
};
