import { AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "./token-storage";

// Store the refresh token promise
let refreshTokenRequest: Promise<
  AxiosResponse<{ accesstoken: string }>
> | null = null;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const originalRequest = error.config;
    const accessToken = getAccessToken();

    if (
      error.response?.status !== 401 ||
      originalRequest?.url?.includes("login")
    ) {
      return Promise.reject(error);
    }

    if (originalRequest && accessToken) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.location.href = "/auth";
        return Promise.reject(error);
      }

      if (!refreshTokenRequest) {
        refreshTokenRequest = refreshAccessToken(refreshToken)
          .then((token) => {
            if (!token) throw new Error("No token received");
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return api(originalRequest);
            }
            throw new Error("No headers in original request");
          })
          .catch((error) => {
            refreshTokenRequest = null;
            clearTokens();
            window.location.href = "/auth";
            return Promise.reject(error);
          });
        return refreshTokenRequest;
      }
      return refreshTokenRequest.then((token) => {
        if (originalRequest.headers)
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
      });
    }
    window.location.href = "/auth";
    return Promise.reject(error.response?.data) as Promise<ApiError>;
  }
);

export type ApiError = {
  message: string;
  error: string;
  statusCode: number;
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const res = await api.post("/auth/refresh-access-token", {
      refreshToken,
    });
    setAccessToken(res.data.accessToken);
    return res?.data?.accessToken;
  } catch (err) {
    clearTokens();
    throw err;
  }
};

export default api;
