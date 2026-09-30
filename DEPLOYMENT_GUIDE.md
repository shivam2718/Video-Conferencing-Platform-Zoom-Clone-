# Deployment Guide - Zoom Clone

## Frontend Deployment (Vercel) ✅

### Steps:
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import the repository
5. Set Root Directory to `./frontend`
6. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = (your backend URL, set after backend deployment)
7. Deploy

**Your Vercel URL**: Will be provided after deployment

---

## Backend Deployment (Railway - FREE TIER)

Railway is the easiest and cheapest option for FastAPI. Free tier includes $5/month credits.

### Steps:

1. **Go to https://railway.app**
2. **Click "Start New Project"**
3. **Select "Deploy from GitHub"**
4. **Authorize Railway to access your GitHub**
5. **Select your repository**
6. **Select the `backend` directory**
7. **Railway will auto-detect and deploy!**

#### After Railway deploys:

1. Get your backend URL from Railway dashboard
2. Go back to Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-railway-backend.railway.app`
4. Redeploy Vercel

---

## Backend Deployment (Alternative: Render)

If Railway doesn't work, use Render.com:

### Steps:

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Set:
   - **Name**: zoom-clone-backend
   - **Root Directory**: backend
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`
6. Deploy

---

## Environment Variables for Backend

Set these in Railway/Render dashboard:

```
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

---

## Testing After Deployment

1. Visit your Vercel URL
2. Try:
   - Create instant meeting
   - Schedule a meeting
   - Join a meeting
3. Check browser console for errors

---

## Troubleshooting

**"Connection refused" errors?**
- Check CORS_ORIGINS environment variable
- Ensure backend URL is correct in Vercel

**Database issues?**
- SQLite works but data resets on restart
- For production, upgrade to PostgreSQL (Neon.tech offers free tier)

**Can't join meetings?**
- Verify backend is running: `curl https://your-backend-url/`
- Check NEXT_PUBLIC_API_URL in Vercel

