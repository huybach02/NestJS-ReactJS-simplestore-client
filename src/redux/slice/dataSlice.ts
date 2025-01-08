/* eslint-disable @typescript-eslint/no-explicit-any */
import {baseService} from "@/service/baseService";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export interface DataState {
  showSidebar: boolean;
  showMiniCart: boolean;
  wishlist: any[];
}

const initialState: DataState = {
  showSidebar: false,
  showMiniCart: false,
  wishlist: [],
};

export const reloadWishlist = createAsyncThunk(
  "data/reloadWishlist",
  async () => {
    const wishlist = await baseService.getWishlist();
    return wishlist.data;
  }
);

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setShowMiniCart: (state) => {
      state.showMiniCart = true;
    },
    setCloseMiniCart: (state) => {
      state.showMiniCart = false;
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
    clearWishlist: (state) => {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reloadWishlist.fulfilled, (state, action) => {
      state.wishlist = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const {setShowMiniCart, setCloseMiniCart, setWishlist, clearWishlist} =
  dataSlice.actions;

export default dataSlice.reducer;
