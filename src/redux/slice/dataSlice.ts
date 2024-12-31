import {createSlice} from "@reduxjs/toolkit";

export interface DataState {
  showSidebar: boolean;
  showMiniCart: boolean;
}

const initialState: DataState = {
  showSidebar: false,
  showMiniCart: false,
};

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
  },
});

// Action creators are generated for each case reducer function
export const {setShowMiniCart, setCloseMiniCart} = dataSlice.actions;

export default dataSlice.reducer;
