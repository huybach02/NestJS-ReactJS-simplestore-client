/* eslint-disable @typescript-eslint/no-explicit-any */
import {message} from "antd";
import axiosInstance from "../config/axios";
import {LoginType, RegisterType, SocialLoginType} from "../types/authType";

export const authService = {
  register: async (data: RegisterType) => {
    try {
      return await axiosInstance.post("/auth/register", data);
    } catch (error: any) {
      message.error(error.response.data.message);
      return Promise.reject(error);
    }
  },

  login: async (data: LoginType) => {
    try {
      return await axiosInstance.post("/auth/login", data);
    } catch (error: any) {
      message.error(error.response.data.message);
      return Promise.reject(error);
    }
  },

  socialLogin: async (data: SocialLoginType) => {
    try {
      return await axiosInstance.post("/auth/social-login", data);
    } catch (error: any) {
      message.error(error.response.data.message);
      return Promise.reject(error);
    }
  },

  logout: async () => {
    try {
      return await axiosInstance.get("/auth/logout");
    } catch (error: any) {
      return Promise.reject(error);
    }
  },

  me: async () => {
    try {
      return await axiosInstance.get("/auth/me");
    } catch (error: any) {
      // message.error(error.response.data.message);
      console.log(error);
    }
  },
};
