import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Allow multiple origins (comma separated) e.g. CORS_ORIGIN="http://localhost:5173,http://localhost:8080"
const originList = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:8080,http://localhost:8081')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Helper: detect private LAN origins (when enabled)
const privateLanRegex = /^https?:\/\/(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|127\.0\.0\.1|localhost)(?::\d+)?$/;

const allowLan = process.env.ALLOW_LAN === '1';
app.use(cors({
  origin: (origin, cb) => {
    // Allow same-origin or server-to-server (no origin), listed origins, and local LAN patterns in dev.
    const dev = process.env.NODE_ENV !== 'production';
    const lanOk = allowLan && dev && privateLanRegex.test(origin || '');
    if (!origin || originList.includes(origin) || lanOk) {
      return cb(null, true);
    }
    if (process.env.DEBUG_ROUTES === '1') {
      console.warn('[CORS_BLOCK]', origin, 'not in', originList, 'LAN_ENABLED?', allowLan, 'LAN_MATCH?', lanOk);
    }
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
// Basic request logger (before routes) for debugging path issues
app.use((req, res, next) => {
  const debugRoutes = process.env.DEBUG_ROUTES === '1';
  const debugProducts = process.env.DEBUG_PRODUCTS === '1';
  if (debugRoutes) {
    console.log('[REQ]', req.method, req.originalUrl);
  }
  if (debugProducts && /\/api\/products/.test(req.originalUrl)) {
    console.log('[PRODUCT_REQ]', req.method, req.originalUrl, 'ct=', req.headers['content-type']);
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'EcoFinds API' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
