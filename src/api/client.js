import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Access token lives in a module variable: gone on refresh, safe from XSS reads of localStorage
let accessToken = null;
let onAuthFailure = null; // AuthContext registers a logout callback here

export const setAccessToken = (token) => { accessToken = token; };
export const setAuthFailureHandler = (fn) => { onAuthFailure = fn; };

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the httpOnly refresh cookie
});

// Attach the token to every outgoing request
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Routes where a 401 means "wrong credentials", not "token expired"
const NO_REFRESH = ['/auth/login', '/auth/signup', '/auth/refresh'];

// Single-flight: if 5 requests fail at once, only ONE refresh call is made
let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const skip = NO_REFRESH.some((p) => original.url?.startsWith(p));

    if (error.response?.status === 401 && !original._retry && !skip) {
      original._retry = true; // prevents infinite retry loops

      refreshPromise ??= axios
        .post(`${BASE_URL}/auth/refresh`, null, { withCredentials: true })
        .then((r) => r.data.accessToken)
        .finally(() => { refreshPromise = null; });

      try {
        const newToken = await refreshPromise;
        setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // replay the original request
      } catch (refreshError) {
        setAccessToken(null);
        onAuthFailure?.();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;