import axios from "axios";

type TokenGetter = () => string | undefined;

let tokenGetter: TokenGetter | null = null;

export const registerTokenGetter = (getter: TokenGetter) => {
  tokenGetter = getter;
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Attach Authorization header when token is available
api.interceptors.request.use((config) => {
  try {
    const token = tokenGetter?.();
    if (token) {
      config.headers = config.headers ?? {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore allow axios header typing
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // noop: if token getter throws, just continue without Authorization header
  }
  return config;
});

export default api;
