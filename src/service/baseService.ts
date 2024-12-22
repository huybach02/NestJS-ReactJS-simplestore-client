/* eslint-disable @typescript-eslint/no-explicit-any */
import {message} from "antd";
import axiosInstance from "../config/axios";
import {CategoryType} from "../types/categoryType";

export const baseService = {
  findAll: async (
    endpoint: string,
    page: number = 1,
    limit: number = 10,
    query?: any
  ) => {
    try {
      if (query) {
        return await axiosInstance.get(
          `${endpoint}?page=${page}&limit=${limit}&query=${JSON.stringify(
            query
          )}`
        );
      } else {
        return await axiosInstance.get(
          `${endpoint}?page=${page}&limit=${limit}`
        );
      }
    } catch (error: any) {
      message.error(error.response.data.message);
      return Promise.reject(error);
    }
  },

  findAllVariants: async (endpoint: string, productId: string) => {
    return await axiosInstance.get(`${endpoint}?productId=${productId}`);
  },

  getCategoriesBySuperCategory: async (superCategoryId: string) => {
    const response = await axiosInstance.get(
      `categories/by-super-category/${superCategoryId}`
    );

    return response.data.map((category: CategoryType) => ({
      label: category.name,
      value: category._id,
    }));
  },
};
