# AgroConnect Frontend - Render Deployment Guide

## Prerequisites
- Backend deployed first at: `https://agroconnect-backend.onrender.com`
- GitHub repository with frontend code
- Render account

## Deployment Options

### Option 1: Static Site (Recommended - Free)
1. **Create Static Site on Render**
   - Connect your GitHub repository
   - Use automatic deployment with `render.yaml`

2. **Environment Variables** (Set in Render Dashboard):
   ```
   REACT_APP_API_URL=https://agroconnect-backend.onrender.com/api
   GENERATE_SOURCEMAP=false
   DISABLE_ESLINT_PLUGIN=true
   REACT_APP_ENV=production
   ```

3. **Build Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### Option 2: Web Service (If you need server-side features)
1. **Manual Configuration**:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run serve`
   - **Port**: 3000

## Important Configuration Changes Made

### 1. **Package.json Updates**
- ✅ Removed proxy setting (conflicts with production)
- ✅ Added `serve` script for production serving
- ✅ Added `serve` dependency

### 2. **Environment Configuration**
- ✅ Created `.env.production` with production API URL
- ✅ Created `.env.example` template
- ✅ Configured `REACT_APP_API_URL` to point to backend

### 3. **CORS Configuration** 
- ✅ Updated backend to allow frontend domain
- ✅ Added `https://agroconnect-frontend.onrender.com` to allowed origins

### 4. **Build Optimizations**
- ✅ Disabled source maps for production (`GENERATE_SOURCEMAP=false`)
- ✅ Disabled ESLint plugin for faster builds (`DISABLE_ESLINT_PLUGIN=true`)

## Deployment Steps

### Step 1: Deploy Backend First
1. Make sure your backend is deployed at: `https://agroconnect-backend.onrender.com`
2. Test backend health: `https://agroconnect-backend.onrender.com/health`

### Step 2: Deploy Frontend
1. **Push Code**: Commit and push all frontend changes
2. **Create Render Service**: 
   - Go to Render Dashboard
   - Create new Static Site (or Web Service)
   - Connect your frontend repository
3. **Set Environment Variables**:
   ```
   REACT_APP_API_URL=https://agroconnect-backend.onrender.com/api
   GENERATE_SOURCEMAP=false
   DISABLE_ESLINT_PLUGIN=true
   ```
4. **Deploy**: Render will automatically build and deploy

### Step 3: Update Backend CORS
1. Add frontend URL to backend environment variables:
   ```
   FRONTEND_URL=https://agroconnect-frontend.onrender.com
   ```
2. Redeploy backend if needed

## Testing Your Deployment

### 1. **Frontend Tests**
- ✅ Visit: `https://agroconnect-frontend.onrender.com`
- ✅ Check console for API connection errors
- ✅ Test login/signup functionality
- ✅ Test plant identification feature

### 2. **API Connection Tests**
- ✅ Open Network tab in browser dev tools
- ✅ Verify API calls go to correct backend URL
- ✅ Check for CORS errors (should be none)

### 3. **Feature Tests**
- ✅ User registration/login
- ✅ Plant identification with image upload
- ✅ AI assistant functionality
- ✅ Enhanced plant analysis with condition diagnosis

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend includes frontend URL in CORS origins
   - Check backend environment variable `FRONTEND_URL`

2. **API Connection Fails**
   - Verify `REACT_APP_API_URL` environment variable
   - Check backend is running: test `/health` endpoint

3. **Build Failures**
   - Check for TypeScript errors
   - Ensure all dependencies are in `package.json`
   - Review build logs in Render dashboard

4. **Routing Issues (SPA)**
   - Ensure `render.yaml` includes route rewrite rules
   - Check that `routes` section redirects to `index.html`

## URLs After Deployment

- **Frontend**: `https://agroconnect-frontend.onrender.com`
- **Backend**: `https://agroconnect-backend.onrender.com`
- **API Health**: `https://agroconnect-backend.onrender.com/health`

## Performance Notes

- Static site deployment is faster and free
- First load might be slow (Render free tier limitation)
- Consider upgrading to paid plans for better performance
- Images and builds are cached for subsequent deployments

## Success Checklist

- ✅ Backend deployed and health check working
- ✅ Frontend builds successfully
- ✅ CORS configured correctly
- ✅ Environment variables set
- ✅ Plant identification workflow working
- ✅ All features functional in production

Your frontend is now ready for production deployment on Render!
