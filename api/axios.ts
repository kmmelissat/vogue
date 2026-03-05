import axios from "axios";
import { API_CONFIG } from "./constants";

export const vogueApi = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    "x-frontend-source": API_CONFIG.frontendSource,
  },
  auth: API_CONFIG.auth,
});
