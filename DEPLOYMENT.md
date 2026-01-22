# Deployment Guide

## Production Build

```bash
npm run build
```

Build output: `dist/` directory

## Environment Variables

### Development
```env
VITE_API_URL=http://localhost:8000/api
```

### Production
```env
VITE_API_URL=https://api.example.com/api
```

## Deployment Options

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL production
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variable in Netlify dashboard
```

### Manual (Static Hosting)

Build and upload the `dist/` folder to any static hosting:
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting
- Cloudflare Pages

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:
```bash
docker build -t ucrs-frontend .
docker run -p 3000:80 ucrs-frontend
```

## Backend Configuration

Ensure backend CORS allows the production frontend domain:

```env
# Backend .env
CORS_ALLOWED_ORIGINS=https://frontend.example.com
```

## Checklist

- [ ] Update VITE_API_URL to production API
- [ ] Update backend CORS_ALLOWED_ORIGINS
- [ ] Build project: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Deploy `dist/` folder
- [ ] Verify frontend connects to backend
- [ ] Test authentication flow
- [ ] Configure CDN (optional)
- [ ] Set up CI/CD (optional)

## CI/CD Example (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

## Performance

Build size (approximate):
- HTML: <1 KB
- CSS: ~10 KB (gzip: ~2.5 KB)
- JS: ~306 KB (gzip: ~100 KB)

Optimizations:
- Code splitting enabled
- Tree shaking enabled
- Minification enabled
- Gzip compression recommended

## Monitoring

Consider adding:
- Sentry for error tracking
- Google Analytics
- LogRocket for session replay
