import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear the access token cookie
	cookies.delete('accessToken', { path: '/' });
	
	// Redirect to login page
	throw redirect(303, '/login');
};
