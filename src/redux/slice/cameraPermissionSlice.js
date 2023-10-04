import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGranted: false,
};
const cameraPermissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    savePermission: (state, action) => {
      state.isGranted = action.payload;
    },
  },
});

export const { savePermission } = cameraPermissionSlice.actions;
export default cameraPermissionSlice.reducer;
