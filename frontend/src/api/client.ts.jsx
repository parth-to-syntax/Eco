import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to set/unset Bearer manually when storing token separately if needed
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Debug instrumentation
const DEBUG = import.meta.env.VITE_DEBUG === '1';

if (DEBUG) {
  // Track a rolling log in window for quick inspection
  (window as any).__AXIOS_LOG__ = (window as any).__AXIOS_LOG__ || [];
  const pushLog = (entry: any) => {
    (window as any).__AXIOS_LOG__.push(entry);
    if ((window as any).__AXIOS_LOG__.length > 100) (window as any).__AXIOS_LOG__.shift();
  };
  api.interceptors.request.use((config) => {
    const logEntry = {
      type: 'request',
      method: config.method,
      url: config.baseURL + (config.url || ''),
      headers: config.headers,
      data: config.data,
      time: new Date().toISOString()
    };
    console.debug('[API REQUEST]', logEntry);
    pushLog(logEntry);
    return config;
  });
  api.interceptors.response.use(
    (response) => {
      const logEntry = {
        type: 'response',
        status: response.status,
        url: response.config.baseURL + (response.config.url || ''),
        data: response.data,
        time: new Date().toISOString()
      };
      console.debug('[API RESPONSE]', logEntry);
      pushLog(logEntry);
      return response;
    },
    (error: AxiosError) => {
      const logEntry = {
        type: 'error',
        url: error.config ? (error.config.baseURL || '') + (error.config.url || '') : undefined,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        time: new Date().toISOString()
      };
      console.warn('[API ERROR]', logEntry);
      pushLog(logEntry);
      return Promise.reject(error);
    }
  );
}

export const isDebug = () => DEBUG;
