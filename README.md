# UCRS Frontend

React frontend for the University Course Registration System.

## Tech Stack

- React 18
- TypeScript
- Vite
- TanStack Query
- React Router
- Tailwind CSS
- shadcn/ui
- Axios

## Prerequisites

- Node.js 20+
- npm or pnpm

## Installation

```bash
npm install
```

## Configuration

Create `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

## Development

```bash
npm run dev
```

Frontend runs on: http://localhost:5173

## Backend Connection

Backend API must be running on: http://localhost:8000

Ensure the Laravel backend is running before starting the frontend.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

The app uses Bearer token authentication via Laravel Sanctum.

Tokens are stored in localStorage and automatically included in API requests.

## Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
├── lib/
│   ├── api.ts        # Axios instance
│   ├── queryClient.ts # TanStack Query config
│   └── utils.ts      # Utility functions
├── pages/
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── services/
│   └── authService.ts # Authentication service
├── App.tsx
├── main.tsx
└── index.css
```

## Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

## Production Build

```bash
npm run build
```

Output: `dist/` directory

Deploy the `dist/` folder to any static hosting (Vercel, Netlify, etc.)

## Environment Variables

Development:
```env
VITE_API_URL=http://localhost:8000/api
```

Production:
```env
VITE_API_URL=https://api.example.com/api
```
