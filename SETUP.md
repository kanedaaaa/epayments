# ePayment Setup Guide

## Authentication Implementation

The authentication system has been set up with **JWT stored in httpOnly cookies** for security. Here's what was implemented:

### Backend Changes

1. **Dependencies Added:**
   - `cookie-parser` - Parse cookies from requests
   - `cors` - Enable cross-origin requests with credentials
   - `bcrypt` - Password hashing
   - `jsonwebtoken` - JWT token generation

2. **Key Features:**
   - JWT tokens stored in httpOnly cookies (not accessible via JavaScript)
   - CORS configured to accept credentials from frontend
   - Auth middleware reads JWT from cookies (with Bearer token fallback)
   - Logout endpoint to clear cookies

3. **API Endpoints:**
   - `POST /api/merchants/signup` - Create account and set JWT cookie
   - `POST /api/merchants/login` - Login and set JWT cookie
   - `POST /api/merchants/logout` - Clear JWT cookie
   - `GET /api/merchants/me` - Get current user (requires auth)

### Frontend Changes

1. **SvelteKit Form Actions:**
   - Server-side form handling for login/signup
   - Automatic cookie forwarding from backend to client
   - Progressive enhancement with `use:enhance`

2. **Pages Created:**
   - `/login` - Login form with error handling
   - `/signup` - Signup form with error handling
   - `/dashboard` - Protected page showing user info
   - `/logout` - Logout endpoint

3. **Features:**
   - Form validation
   - Error display
   - Automatic redirect after login/signup
   - Protected routes with server-side auth check

## Setup Instructions

### Backend Setup

1. **Copy environment file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Configure .env:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/epayment?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Install dependencies:**
   ```bash
   pnpm install
   ```

4. **Setup database:**
   ```bash
   pnpm db:push
   # or
   pnpm db:migrate
   ```

5. **Start backend:**
   ```bash
   pnpm dev
   ```

### Frontend Setup

1. **Copy environment file:**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Configure .env:**
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Install dependencies:**
   ```bash
   pnpm install
   ```

4. **Start frontend:**
   ```bash
   pnpm dev
   ```

## Testing the Authentication

1. **Start both servers:**
   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:5173`

2. **Create an account:**
   - Navigate to `http://localhost:5173/signup`
   - Fill in name, email, and password
   - Submit form
   - You'll be redirected to `/dashboard`

3. **Login:**
   - Navigate to `http://localhost:5173/login`
   - Enter email and password
   - Submit form
   - You'll be redirected to `/dashboard`

4. **Logout:**
   - Click the logout button on dashboard
   - You'll be redirected to `/login`

## Security Features

- ✅ **httpOnly cookies** - JWT not accessible via JavaScript (XSS protection)
- ✅ **sameSite: 'lax'** - CSRF protection
- ✅ **Secure flag** - Enabled in production (HTTPS only)
- ✅ **Password hashing** - bcrypt with 10 salt rounds
- ✅ **CORS with credentials** - Only allows requests from configured frontend
- ✅ **Server-side validation** - All auth logic on backend

## API Client Usage (Optional)

For client-side API calls, use the API client in `/frontend/src/lib/api.ts`:

```typescript
import { api } from '$lib/api';

// Login
const result = await api.login({ email, password });

// Get current user
const merchant = await api.getMe();

// Logout
await api.logout();
```

Note: The form actions handle auth automatically, so you typically won't need the API client for login/signup.

## TypeScript Errors

If you see TypeScript errors about missing types (`./$types`), run the dev server once to generate SvelteKit's types:

```bash
cd frontend
pnpm dev
```

The types will be auto-generated in `.svelte-kit/types/`.
