/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import queryString from "query-string";
import {message} from "antd";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  paramsSerializer: (params) => {
    return queryString.stringify(params);
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  config.headers.Authorization = "";
  config.headers["Content-Type"] = "application/json";
  config.withCredentials = true;
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];
let isRedirecting = false;

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.status >= 200 && response.status < 300) {
      if (response.data.message) {
        message.success(response.data.message);
      }
      return response.data;
    } else {
      return Promise.reject(response);
    }
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 419 ||
      error.response.data.error_code === "TOKEN_EXPIRED"
      // && !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then(() => {
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API để làm mới token
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          withCredentials: true,
        });

        // Token mới đã được tự động đặt vào cookie bởi server
        const response = await axios(originalRequest);
        processQueue(null);
        return response;
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response.status === 401 && !isRedirecting) {
      isRedirecting = true;
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
