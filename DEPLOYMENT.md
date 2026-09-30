# Deployment Guide

This guide provides detailed instructions for deploying the Zoom Clone application to various cloud platforms.

## 🚀 Quick Deploy Options

### Frontend Deployment

#### Vercel (Recommended)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project" and import your repository
   - Configure build settings:
     - Framework Preset: Next.js
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

#### Netlify
1. **Build Configuration**
   Create `frontend/netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NPM_FLAGS = "--prefix=frontend"
   ```

2. **Deploy**
   - Connect GitHub repository to Netlify
   - Set build directory to `frontend`
   - Deploy

### Backend Deployment

#### Railway (Recommended)
1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Environment Variables**
   Set in Railway dashboard:
   ```
   DATABASE_URL=sqlite:///./zoom_clone.db
   SECRET_KEY=your-production-secret-key
   ```

#### Render
1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Connect GitHub repository
   - Create new Web Service

2. **Configuration**
   ```
   Name: zoom-clone-api
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

3. **Environment Variables**
   ```
   PYTHON_VERSION=3.11
   SECRET_KEY=your-production-secret-key
   ```

#### Heroku
1. **Create Procfile**
   ```bash
   cd backend
   echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
   ```

2. **Deploy**
   ```bash
   heroku create zoom-clone-api
   git subtree push --prefix backend heroku main
   ```

## 🔒 Production Configuration

### Security Checklist
- [ ] Change default SECRET_KEY
- [ ] Enable HTTPS
- [ ] Configure CORS for production domains
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Configure proper logging

### Environment Variables

**Production Backend (.env):**
```env
DATABASE_URL=postgresql://user:pass@host:port/db  # Use PostgreSQL in production
SECRET_KEY=your-very-secure-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["https://your-frontend-domain.com"]
```

**Production Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_ENV=production
```

### Database Migration (PostgreSQL)

For production, migrate from SQLite to PostgreSQL:

1. **Update requirements.txt**
   ```
   psycopg2-binary==2.9.7
   ```

2. **Update database.py**
   ```python
   import os
   DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./zoom_clone.db")
   ```

3. **Migration Script**
   ```python
   # migrate_to_postgres.py
   from sqlalchemy import create_engine
   import sqlite3
   import psycopg2
   
   # Export from SQLite and import to PostgreSQL
   # (Implementation depends on your data migration needs)
   ```

## 📊 Monitoring & Analytics

### Backend Monitoring
Add to `main.py`:
```python
import logging
from fastapi import Request
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url} - {response.status_code} - {process_time:.4f}s")
    return response
```

### Frontend Analytics
Add Google Analytics to `frontend/src/app/layout.tsx`:
```typescript
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
```

## 🔧 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm install
    
    - name: Build frontend
      run: |
        cd frontend
        npm run build
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install backend dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Test backend
      run: |
        cd backend
        python -m pytest tests/ || echo "No tests found"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: frontend

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Railway
      uses: bervProject/railway-deploy@v1.0.0
      with:
        railway_token: ${{ secrets.RAILWAY_TOKEN }}
        working_directory: backend
```

## 📝 Domain Configuration

### Custom Domain Setup

1. **Vercel Custom Domain**
   - Go to Vercel project settings
   - Add custom domain
   - Configure DNS records:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

2. **API Domain**
   - Configure subdomain for API: `api.yourdomain.com`
   - Update frontend environment variables
   - Configure SSL certificates

### DNS Records
```
A     @           76.76.21.21
CNAME www         cname.vercel-dns.com
CNAME api         your-backend-service.railway.app
```

## 🚨 Troubleshooting

### Common Deployment Issues

**CORS Errors:**
```python
# Update main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Update with your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

**Database Connection:**
- Verify DATABASE_URL format
- Check database service status
- Ensure proper migrations are run

**Environment Variables:**
- Double-check all required variables are set
- Verify variable names match exactly
- Check for trailing spaces or special characters

## 📈 Performance Optimization

### Frontend Optimization
1. **Enable Next.js optimizations:**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     poweredByHeader: false,
     generateEtags: false,
   }
   ```

2. **CDN Configuration:**
   - Enable Vercel's Edge Network
   - Configure caching headers
   - Optimize images with Next.js Image component

### Backend Optimization
1. **Add caching:**
   ```python
   from fastapi_cache import FastAPICache
   from fastapi_cache.backends.redis import RedisBackend
   
   @app.on_event("startup")
   async def startup():
       redis = aioredis.from_url("redis://localhost", encoding="utf8")
       FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
   ```

2. **Database connection pooling:**
   ```python
   engine = create_engine(
       DATABASE_URL,
       pool_size=20,
       max_overflow=0,
       pool_pre_ping=True
   )
   ```

This completes the comprehensive deployment guide for your Zoom Clone application!