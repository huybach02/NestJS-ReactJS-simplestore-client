/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/config/axios";
import {ReviewType} from "@/types/reviewType";
import {message} from "antd";

export const reviewService = {
  addReview: async (item: ReviewType) => {
    try {
      return await axiosInstance.post(`reviews`, item);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  getReviews: async (productId: string) => {
    try {
      return await axiosInstance.get(`reviews/by-product/${productId}`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
};
