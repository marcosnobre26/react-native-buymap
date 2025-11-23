import { useAuthStore } from '@/src/features/auth/store/authStore';
import axios from 'axios';

const PROD_URL = 'https://unanaemic-tychopotamic-ara.ngrok-free.dev/api/v1';

export const api = axios.create({
  baseURL: PROD_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use(async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            console.log("API Error Status:", error.response.status);
            console.log("API Error Data:", error.response.data);
        } else {
            console.log("API Error (Sem resposta):", error.message);
        }
        return Promise.reject(error);
    }
);