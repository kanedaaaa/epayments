import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

export const actions = {
	default: async ({ request, cookies }: RequestEvent) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		try {
			const response = await fetch(`${API_BASE_URL}/api/merchants/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({ error: 'Login failed' }));
				return fail(response.status, { error: error.error || 'Login failed' });
			}

			// Get the Set-Cookie header from the backend response
			const setCookieHeader = response.headers.get('set-cookie');
			if (setCookieHeader) {
				// Parse and forward the cookie to the client
				const cookieMatch = setCookieHeader.match(/accessToken=([^;]+)/);
				if (cookieMatch) {
					cookies.set('accessToken', cookieMatch[1], {
						path: '/',
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'lax',
						maxAge: 60 * 60 * 24 * 30, // 30 days
					});
				}
			}

			const result = await response.json();
			
			// Login successful
			return { success: true };
		} catch (error) {
			if (error instanceof Response) {
				throw error; // Re-throw redirect
			}
			return fail(500, { error: 'An unexpected error occurred' });
		}
	},
} satisfies Actions;
