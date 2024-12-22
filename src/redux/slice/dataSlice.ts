import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface DataState {
  showSidebar: boolean;
}

const initialState: DataState = {
  showSidebar: false,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = dataSlice.actions;

export default dataSlice.reducer;
