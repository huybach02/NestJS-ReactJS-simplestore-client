/* eslint-disable @typescript-eslint/no-explicit-any */
import {CartItem} from "@/types/cartType";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface CartState {
  cart: CartItem[];
  cartSelectedItems: CartItem[];
  voucherUsed: any;
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
}

const initialState: CartState = {
  cart: [],
  cartSelectedItems: [],
  voucherUsed: null,
  subTotal: 0,
  discountAmount: 0,
  finalTotal: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setCartSelectedItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cartSelectedItems = action.payload;
    },
    setVoucherUsed: (state, action: PayloadAction<any>) => {
      state.voucherUsed = action.payload;
    },
    clearVoucherUsed: (state) => {
      state.voucherUsed = null;
    },
    setDiscountAmountAndFinalTotal: (
      state,
      action: PayloadAction<{
        subTotal: number;
        discountAmount: number;
        finalTotal: number;
      }>
    ) => {
      state.subTotal = action.payload.subTotal;
      state.discountAmount = action.payload.discountAmount;
      state.finalTotal = action.payload.finalTotal;
    },
    clearDiscountAmountAndFinalTotal: (state) => {
      state.subTotal = 0;
      state.discountAmount = 0;
      state.finalTotal = 0;
    },
    clearAboutToCart: (state) => {
      state.cartSelectedItems = [];
      state.voucherUsed = null;
      state.subTotal = 0;
      state.discountAmount = 0;
      state.finalTotal = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCart,
  clearCart,
  setCartSelectedItems,
  setVoucherUsed,
  clearVoucherUsed,
  setDiscountAmountAndFinalTotal,
  clearDiscountAmountAndFinalTotal,
  clearAboutToCart,
} = cartSlice.actions;

export default cartSlice.reducer;
