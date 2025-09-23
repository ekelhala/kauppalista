import axios from "axios";
import { DEV_API_URL, PROD_API_URL } from "../constants";

type TokenGetter = () => string | undefined;

let tokenGetter: TokenGetter | null = null;

export const registerTokenGetter = (getter: TokenGetter) => {
  tokenGetter = getter;
}

const BASE_URL = import.meta.env.DEV ? DEV_API_URL : PROD_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
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
