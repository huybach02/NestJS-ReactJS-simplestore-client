/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/config/axios";
import {AddToCartItem} from "@/types/cartType";
import {message} from "antd";
import {Key} from "antd/es/table/interface";

export const cartService = {
  addToCart: async (item: AddToCartItem) => {
    try {
      return await axiosInstance.post(`carts/add-to-cart`, item);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  getCart: async () => {
    try {
      return await axiosInstance.get(`carts`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  removeFromCart: async (itemId: string) => {
    try {
      return await axiosInstance.delete(`carts/${itemId}`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  clearAllCart: async () => {
    try {
      return await axiosInstance.delete(`carts/clear-all`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  updateCart: async (itemId: string, quantity: number) => {
    try {
      return await axiosInstance.put(`carts/${itemId}`, {quantity});
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  applyVoucher: async (voucher: string, selectedItems: Key[]) => {
    try {
      return await axiosInstance.post(`carts/apply-voucher`, {
        voucher,
        selectedItems,
      });
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  getAllVoucher: async () => {
    try {
      return await axiosInstance.get(`vouchers/active`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  placeOrder: async (placeOrderData: any) => {
    try {
      return await axiosInstance.post(`orders/place-order`, placeOrderData);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  getCartTemp: async () => {
    try {
      return await axiosInstance.get(`orders/cart-temp`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
};
