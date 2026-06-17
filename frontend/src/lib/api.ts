import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://jobbly-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header dynamically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
const normalizeErrorMessage = (value: unknown) => {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message || "An unexpected error occurred.";

  try {
    const json = JSON.stringify(value, Object.getOwnPropertyNames(value));
    if (json) return json;
  } catch {
    // Fall through to string conversion below
  }

  try {
    return String(value);
  } catch {
    return "An unexpected error occurred.";
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as any;
    const rawMessage = responseData?.message ?? axiosError.message ?? "An unexpected error occurred.";
    const message = normalizeErrorMessage(rawMessage);

    const customError = new Error(message);
    (customError as any).status = axiosError.response?.status;
    (customError as any).errors = responseData?.errors;
    (customError as any).code = axiosError.code;

    return Promise.reject(customError);
  }
);

export default api;
