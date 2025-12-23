# Environment Variables for Backend Deployment

## Required Environment Variables
MONGO_URI=mongodb+srv://jkbs_lore:punjabimistry@cluster0.pvcoxtl.mongodb.net/ecofinds?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=production
JWT_SECRET=ecofinds-production-secret-change-this

## CORS - Add your frontend Vercel domain
CORS_ORIGIN=https://your-frontend-domain.vercel.app
ALLOW_LAN=0

## Cloudinary (Optional - for image uploads)
CLOUDINARY_API_SECRET=VxtpPX9abcNzeaHojspDkYOOP9g
CLOUDINARY_API_KEY=232554239951375
CLOUDINARY_CLOUD_NAME=di5d7yavn

## Debug Flags (turn off in production)
DEBUG_AUTH=0
DEBUG_ROUTES=0
DEBUG_PRODUCTS=0
DEBUG_USERS=0
