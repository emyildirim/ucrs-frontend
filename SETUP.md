# UCRS Frontend Setup Complete

## Installation Completed

The standalone React frontend has been successfully created and configured.

## What Was Installed

- React 18 with TypeScript
- Vite (build tool)
- TanStack Query (data fetching)
- React Router (routing)
- Axios (HTTP client)
- Tailwind CSS (styling)
- shadcn/ui dependencies (class-variance-authority, clsx, tailwind-merge)

## Project Structure

```
ucrs-frontend/
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   ├── lib/
│   │   ├── api.ts           # Axios instance with interceptors
│   │   ├── queryClient.ts   # TanStack Query configuration
│   │   └── utils.ts         # Utility functions (cn)
│   ├── pages/
│   │   ├── LoginPage.tsx    # Login page component
│   │   └── DashboardPage.tsx # Dashboard page component
│   ├── services/
│   │   └── authService.ts   # Authentication service
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind CSS
├── .env                      # Environment variables
├── vite.config.ts            # Vite configuration with path aliases
├── tailwind.config.js        # Tailwind CSS configuration
└── components.json           # shadcn/ui configuration
```

## Configuration

### Environment Variables
`.env`:
```
VITE_API_URL=http://localhost:8000/api
```

### Path Aliases
TypeScript path alias `@/*` configured to point to `src/*`.

Usage:
```typescript
import api from '@/lib/api';
import { authService } from '@/services/authService';
```

### API Client
Configured in `src/lib/api.ts`:
- Automatic Bearer token injection
- 401 redirect to login
- CORS credentials support

### TanStack Query
Configured with:
- No refetch on window focus
- 1 retry attempt
- 5 minute stale time

## Running the Application

### Development Server
```bash
npm run dev
```
Access at: http://localhost:5173

### Production Build
```bash
npm run build
```
Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## Backend Connection

The frontend is configured to connect to the Laravel backend at:
```
http://localhost:8000/api
```

### Ensure Backend is Running
```bash
cd /Users/metiny/GitHub/ucrs-app/ucrs-backend/project
php artisan serve
```

## Features Implemented

### Authentication
- Login page with form validation
- Token storage in localStorage
- Automatic token injection in API requests
- Protected route wrapper
- Logout functionality

### Pages
1. **Login** (`/login`) - Public route
2. **Dashboard** (`/dashboard`) - Protected route
3. **Root** (`/`) - Redirects to dashboard

### API Integration
- Axios client with interceptors
- Bearer token authentication
- Automatic 401 handling
- CORS support

## Test Credentials

Use the test account created in the backend:
```
Email: test@example.com
Password: password123
```

## Adding shadcn/ui Components

Install individual components:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
```

## Verification Steps

1. Backend running: http://localhost:8000/api/hello
2. Frontend running: http://localhost:5173
3. Login with test credentials
4. Verify dashboard loads user data
5. Test logout functionality

## Repository Status

Git repository initialized and committed.

To push to GitHub:
```bash
git remote add origin https://github.com/username/ucrs-frontend.git
git push -u origin main
```

## Next Steps

1. Add more pages (courses, enrollment, etc.)
2. Create reusable components
3. Add form validation
4. Implement course listing
5. Add enrollment functionality
6. Create admin panel

## Dependencies

All dependencies installed and configured:
- @tanstack/react-query: ^5.x
- axios: ^1.x
- react-router-dom: ^7.x
- tailwindcss: 3.4.17
- class-variance-authority
- clsx
- tailwind-merge

## Status

Frontend: Running on http://localhost:5173
Backend API: http://localhost:8000/api
Ready for development!
