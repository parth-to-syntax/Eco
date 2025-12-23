import User from '../models/User.js';
import { generateToken } from '../utils/token.js';

// Helper to attach JWT as HttpOnly cookie (safer for browsers than localStorage)
function setAuthCookie(res, token) {
  const oneHour = 60 * 60 * 1000;
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: oneHour
  });
}

export async function register(req, res) {
  const { name, email, password, avatar } = req.body || {};
  console.log('[REGISTER_REQUEST]', { name, email: email?.substring(0, 5) + '***', hasPassword: !!password, hasAvatar: !!avatar });
  
  if (!name || !email || !password) {
    console.warn('[REGISTER_MISSING_FIELDS]', { name: !!name, email: !!email, password: !!password });
    return res.status(400).json({ message: 'All fields required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  console.log('[REGISTER_ATTEMPT]', {
    originalEmail: email,
    normalizedEmail,
    time: new Date().toISOString()
  });

  try {
    const user = await User.create({ name, email: normalizedEmail, password, avatar });
    console.log('[REGISTER_SUCCESS]', { userId: user._id, email: user.email });
    
    const token = generateToken(user);
    setAuthCookie(res, token);
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar || null },
      token,
      authType: 'cookie+bearer'
    });
  } catch (err) {
    console.error('[REGISTER_ERROR]', {
      message: err.message,
      code: err.code,
      name: err.name
    });
    
    // Handle race condition duplicate
    if (err?.code === 11000 || /duplicate key/i.test(err?.message || '')) {
      console.warn('[REGISTER_DUPLICATE]', { email: normalizedEmail });
      return res.status(400).json({ 
        message: 'Email already registered. Please use a different email or try logging in.', 
        email: normalizedEmail, 
        code: 'DUPLICATE_EMAIL' 
      });
    }
    
    return res.status(500).json({ 
      message: 'Registration failed. Please try again.', 
      error: process.env.NODE_ENV !== 'production' ? err.message : undefined,
      code: 'REGISTER_ERROR' 
    });
  }
}

// Debug utility (DO NOT enable in production). Lists user emails & index info.
export async function debugListUsers(req, res) {
  if (process.env.DEBUG_USERS !== '1') {
    return res.status(403).json({ message: 'Debug disabled' });
  }
  const users = await User.find({}, { email: 1, createdAt: 1 }).limit(100).lean();
  let indexes = [];
  try {
    indexes = await User.collection.indexes();
  } catch {}
  res.json({ count: users.length, users, indexes });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  const normalizedEmail = (email || '').trim().toLowerCase();
  
  console.log('[LOGIN_ATTEMPT]', { email: normalizedEmail.substring(0, 5) + '***', time: new Date().toISOString() });
  
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    console.warn('[LOGIN_FAIL_NO_USER]', { email: normalizedEmail });
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  const match = await user.matchPassword(password);
  if (!match) {
    console.warn('[LOGIN_FAIL_BAD_PASSWORD]', { userId: user._id });
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  console.log('[LOGIN_SUCCESS]', { userId: user._id, email: user.email });
  const token = generateToken(user);
  setAuthCookie(res, token);
  res.json({
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar || null },
    token,
    authType: 'cookie+bearer'
  });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
