import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthSliceState = {
  authToken?: string;
};

const initialState: AuthSliceState = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
  },
});

export const {
  name: authSliceName,
  actions: authActions,
  reducer: authReducer,
} = authSlice;
