import {createSlice} from '@reduxjs/toolkit';

const tokenSlice = createSlice({
  name: 'tokenSlice',
  initialState: {
    token: '',
  },
  reducers: {
    saveToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {saveToken} = tokenSlice.actions;
export default tokenSlice.reducer;
