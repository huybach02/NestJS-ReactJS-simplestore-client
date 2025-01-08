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
    }
  },

  login: async (data: LoginType) => {
    try {
      return await axiosInstance.post("/auth/login", data);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },

  socialLogin: async (data: SocialLoginType) => {
    try {
      return await axiosInstance.post("/auth/social-login", data);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },

  logout: async () => {
    try {
      return await axiosInstance.get("/auth/logout");
    } catch (error: any) {
      message.error(error.response.data.message);
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

  verifyOtp: async (data: {email: string; otp: string}) => {
    try {
      return await axiosInstance.post("/auth/verify-otp", data);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },

  forgotPassword: async (data: {email: string}) => {
    try {
      return await axiosInstance.post("/auth/forgot-password", data);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },

  resetPassword: async (data: {
    email: string;
    otp: string;
    password: string;
  }) => {
    try {
      return await axiosInstance.post("/auth/reset-password", data);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },

  updateProfile: async (data: {
    name: string;
    phone: string;
    avatar: string | undefined;
  }) => {
    try {
      return await axiosInstance.post("/auth/update-profile", data);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },

  changePassword: async (data: {oldPassword: string; newPassword: string}) => {
    try {
      return await axiosInstance.post("/auth/change-password", data);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
};
