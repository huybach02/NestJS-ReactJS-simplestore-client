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
      // return Promise.reject(error);
    }
  },

  findOne: async (endpoint: string, slug: string) => {
    return await axiosInstance.get(`${endpoint}/${slug}`);
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

  getRelatedProduct: async (categoryId: string) => {
    return await axiosInstance.get(`products/related/${categoryId}`);
  },

  addToWishlist: async (productId: string) => {
    try {
      return await axiosInstance.post(`wishlists`, {
        productId,
      });
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },

  getWishlist: async () => {
    return await axiosInstance.get(`wishlists`);
  },

  removeFromWishlist: async (productId: string) => {
    try {
      return await axiosInstance.delete(`wishlists/${productId}`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },

  getAllManageWebsite: async () => {
    return await axiosInstance.get(`manage-website/all`);
  },
};
