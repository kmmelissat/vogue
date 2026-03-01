import axios, { type AxiosInstance } from "axios";
import { API_CONFIG } from "./constants";

const createResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && typeof window !== "undefined") {
        // Client-side: redirigir a login o mostrar modal
        // window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );
};

export const vogueApi = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    "x-frontend-source": API_CONFIG.frontendSource,
  },
  auth: API_CONFIG.auth,
});

createResponseInterceptor(vogueApi);
