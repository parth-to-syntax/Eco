# EcoFinds Deployment Guide

## 🚀 Quick Deployment Steps

### Backend Deployment (Vercel)

1. **Push your code to GitHub** ✅ (Already done)

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository: `parth-to-syntax/Eco`
   - Select the `backend` folder as root directory
   - Add Environment Variables:
     ```
     MONGO_URI=mongodb+srv://jkbs_lore:punjabimistry@cluster0.pvcoxtl.mongodb.net/ecofinds?retryWrites=true&w=majority&appName=Cluster0
     NODE_ENV=production
     JWT_SECRET=ecofinds-production-secret-change-this
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     PORT=5000
     CLOUDINARY_API_SECRET=VxtpPX9abcNzeaHojspDkYOOP9g
     CLOUDINARY_API_KEY=232554239951375
     CLOUDINARY_CLOUD_NAME=di5d7yavn
     DEBUG_AUTH=0
     DEBUG_ROUTES=0
     DEBUG_PRODUCTS=0
     DEBUG_USERS=0
     ```
   - Click Deploy
   - Copy your backend URL (e.g., `https://eco-backend.vercel.app`)

### Frontend Deployment (Vercel)

1. **Update Frontend Environment:**
   - After backend is deployed, go to Vercel dashboard
   - Import the same GitHub repository again
   - Select the `frontend` folder as root directory
   - Add Environment Variables:
     ```
     VITE_API_URL=https://your-backend-url.vercel.app
     VITE_DEBUG=0
     ```
   - Click Deploy
   - Copy your frontend URL (e.g., `https://eco-frontend.vercel.app`)

2. **Update Backend CORS:**
   - Go back to your backend Vercel project
   - Update the `CORS_ORIGIN` environment variable:
     ```
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```
   - Redeploy the backend

## 📋 Environment Variables Summary

### Backend (.env)
```env
MONGO_URI=mongodb+srv://jkbs_lore:punjabimistry@cluster0.pvcoxtl.mongodb.net/ecofinds?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
JWT_SECRET=your-strong-secret-key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
PORT=5000
CLOUDINARY_API_SECRET=VxtpPX9abcNzeaHojspDkYOOP9g
CLOUDINARY_API_KEY=232554239951375
CLOUDINARY_CLOUD_NAME=di5d7yavn
DEBUG_AUTH=0
DEBUG_ROUTES=0
DEBUG_PRODUCTS=0
DEBUG_USERS=0
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.vercel.app
VITE_DEBUG=0
```

## ✅ Pre-Deployment Checklist

- [x] Cloud MongoDB configured
- [x] Backend vercel.json created
- [x] Frontend vercel.json created
- [x] Environment variables documented
- [x] CORS configuration flexible for production
- [x] .gitignore updated
- [x] Code pushed to GitHub

## 🔧 Post-Deployment

1. Test your deployed backend: `https://your-backend-url.vercel.app/api/auth/debug`
2. Test your deployed frontend: `https://your-frontend-url.vercel.app`
3. Verify API connection in browser console

## 🐛 Troubleshooting

- **CORS errors**: Update `CORS_ORIGIN` in backend environment variables
- **API not connecting**: Check `VITE_API_URL` in frontend environment variables
- **Database errors**: Verify MongoDB connection string and network access

## 🔒 Security Notes

- Change `JWT_SECRET` to a strong random string in production
- Never commit `.env` files to GitHub
- Use Vercel environment variables for sensitive data
