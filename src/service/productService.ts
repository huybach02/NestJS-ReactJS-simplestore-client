/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/config/axios";
import {message} from "antd";

export const productService = {
  bestSelling: async (limit: number = 10) => {
    try {
      return await axiosInstance.get(`products/best-selling?limit=${limit}`);
    } catch (error: any) {
      message.error(error.response.data.message);
      return Promise.reject(error);
    }
  },
};
