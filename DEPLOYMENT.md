# 🚀 Deployment Guide

This guide provides comprehensive instructions for deploying the AstralCore Hyperdrive platform to various hosting providers.

## 📋 Pre-Deployment Checklist

### ✅ Required Steps

- [ ] Environment variables configured
- [ ] Build process tested locally
- [ ] Security review completed
- [ ] Performance optimization verified
- [ ] Database migrations prepared (if applicable)
- [ ] SSL certificate ready
- [ ] Domain configured
- [ ] Monitoring setup prepared

### 🔍 Pre-Deployment Verification

```bash
# 1. Install dependencies
npm ci

# 2. Run type checks
npm run type-check

# 3. Run linting
npm run lint

# 4. Test build process
npm run build

# 5. Test production server locally
npm start

# 6. Run deployment verification
node scripts/verify-deployment.js http://localhost:3000
```

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel provides the best Next.js deployment experience with zero configuration.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/astralcore/hyperdrive)

#### Manual Setup

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Configure Project**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   # Set production environment variables
   vercel env add JWT_SECRET production
   vercel env add NEXTAUTH_SECRET production
   vercel env add NEXT_PUBLIC_APP_URL production
   ```

5. **Deploy**
   ```bash
   vercel --prod
   ```

#### Vercel Configuration

The project includes a `vercel.json` file with optimal settings:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs"
}
```

### 2. Netlify

Netlify offers excellent static site hosting with serverless functions.

#### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/astralcore/hyperdrive)

#### Manual Setup

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Project**
   ```bash
   netlify init
   ```

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18.17.0`

5. **Set Environment Variables**
   ```bash
   netlify env:set JWT_SECRET "your-jwt-secret"
   netlify env:set NEXTAUTH_SECRET "your-nextauth-secret"
   netlify env:set NEXT_PUBLIC_APP_URL "https://your-domain.netlify.app"
   ```

6. **Deploy**
   ```bash
   netlify deploy --prod
   ```

#### Netlify Configuration

The project includes a `netlify.toml` file with optimal settings for Next.js.

### 3. Docker Deployment

For custom hosting environments or Kubernetes deployments.

#### Dockerfile

```dockerfile
FROM node:18.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Commands

```bash
# Build image
docker build -t astralcore-hyperdrive .

# Run container
docker run -p 3000:3000 \
  -e JWT_SECRET="your-jwt-secret" \
  -e NEXTAUTH_SECRET="your-nextauth-secret" \
  -e NEXT_PUBLIC_APP_URL="https://your-domain.com" \
  astralcore-hyperdrive

# Push to registry
docker tag astralcore-hyperdrive your-registry/astralcore-hyperdrive:latest
docker push your-registry/astralcore-hyperdrive:latest
```

### 4. AWS Deployment

#### AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Set Environment Variables**
   - Add all required environment variables in Amplify console

#### AWS ECS/Fargate

1. **Build and push Docker image to ECR**
2. **Create ECS task definition**
3. **Configure load balancer**
4. **Deploy service**

### 5. Self-Hosted VPS

For Ubuntu/Debian servers.

#### Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx
```

#### Application Deployment

```bash
# Clone repository
git clone https://github.com/astralcore/hyperdrive.git
cd hyperdrive

# Install dependencies
npm ci

# Create environment file
sudo nano .env.local
# Add your environment variables

# Build application
npm run build

# Start with PM2
pm2 start npm --name "astralcore" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL Setup

```bash
# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Environment Configuration

### Production Environment Variables

```env
# Core Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=AstralCore Hyperdrive
NEXT_PUBLIC_APP_VERSION=5.0.0

# Security
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters

# Features
NEXT_PUBLIC_ENABLE_TRADING=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Monitoring
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn

# APIs
GOOGLE_GENAI_API_KEY=your-gemini-api-key
COINMARKETCAP_API_KEY=your-cmc-api-key
```

### Environment Validation

The application includes automatic environment validation:

```bash
# Test environment configuration
npm run type-check
```

## 🔍 Post-Deployment Verification

### Automated Verification

```bash
# Run deployment verification script
node scripts/verify-deployment.js https://your-domain.com
```

### Manual Verification Checklist

- [ ] Homepage loads correctly
- [ ] All critical pages accessible
- [ ] API endpoints responding
- [ ] SSL certificate valid
- [ ] Performance metrics acceptable
- [ ] Error monitoring active
- [ ] Analytics tracking working

### Performance Testing

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run performance audit
lhci autorun --upload.target=temporary-public-storage
```

## 🔄 CI/CD Pipeline

### GitHub Actions

The project includes a comprehensive CI/CD pipeline:

- **Continuous Integration**: Type checking, linting, security scans
- **Automated Testing**: Unit tests, E2E tests, performance tests
- **Deployment**: Automatic deployment to staging and production
- **Monitoring**: Post-deployment verification and alerts

### Pipeline Configuration

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for the complete pipeline.

### Required Secrets

Configure these secrets in your repository:

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

## 📊 Monitoring and Logging

### Application Monitoring

- **Uptime Monitoring**: Configure external monitoring service
- **Performance Monitoring**: Web Vitals, Core Web Vitals
- **Error Tracking**: Sentry integration
- **Analytics**: Google Analytics 4

### Log Management

```bash
# View PM2 logs (self-hosted)
pm2 logs astralcore

# View Vercel logs
vercel logs

# View Netlify logs
netlify logs
```

## 🔒 Security Considerations

### SSL/TLS

- Always use HTTPS in production
- Configure HTTP to HTTPS redirects
- Use HSTS headers
- Regular SSL certificate renewal

### Security Headers

The application automatically sets security headers:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### Rate Limiting

Built-in rate limiting for:
- API endpoints: 100 requests/15 minutes
- Authentication: 5 attempts/15 minutes
- General pages: 60 requests/minute

## 🚨 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Check Node.js version
node --version  # Should be 18.17.0+
```

#### Environment Variable Issues

```bash
# Verify environment variables
node -e "console.log(process.env)"

# Test environment validation
npm run type-check
```

#### Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
node --inspect-brk server.js
```

### Getting Help

- 📧 Email: [support@astralcore.io](mailto:support@astralcore.io)
- 💬 Discord: [AstralCore Community](https://discord.gg/astralcore)
- 🐛 Issues: [GitHub Issues](https://github.com/astralcore/hyperdrive/issues)

## 📋 Deployment Checklist

### Pre-Production

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Environment variables configured
- [ ] SSL certificate obtained
- [ ] Monitoring setup configured
- [ ] Backup strategy implemented

### Production Deployment

- [ ] Deploy to staging first
- [ ] Run full test suite
- [ ] Verify all functionality
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Monitor for issues
- [ ] Update documentation

### Post-Production

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all integrations
- [ ] Update team on deployment
- [ ] Schedule regular maintenance

---

**Need help with deployment? Contact our team at [support@astralcore.io](mailto:support@astralcore.io)**
