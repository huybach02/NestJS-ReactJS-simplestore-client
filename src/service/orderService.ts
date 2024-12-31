/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/config/axios";
import {AddressType} from "@/types/addressType";
import {message} from "antd";

export const orderService = {
  addAddress: async (item: AddressType) => {
    try {
      return await axiosInstance.post(`orders/address`, item);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  getAddress: async () => {
    try {
      return await axiosInstance.get(`orders/address`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  deleteAddress: async (id: string) => {
    try {
      return await axiosInstance.delete(`orders/address/${id}`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  checkVoucher: async () => {
    try {
      return await axiosInstance.get(`orders/check-voucher`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  selectAddress: async (item: AddressType) => {
    try {
      return await axiosInstance.post(`orders/select-address`, item);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  createPaymentToken: async () => {
    try {
      return await axiosInstance.get(`orders/create-payment-token`);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
  createOrder: async (item: any) => {
    try {
      return await axiosInstance.post(`orders`, item);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  },
};
