import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { clearToken } from "utils/tokenUtils";

const initialState = {
  userInfo: null,
  isLoading: false,
  error: null,
};

export const GlobalSlice = createSlice({
  name: "GlobalSlice",
  initialState,
  reducers: {
    setUserInfo(state, { payload }) {
      state.userInfo = payload;
    },
    setIsLoading(state, { payload }) {
      state.isLoading = payload;
    },
    setError(state, {payload}) {
      state.error = payload;
    }
  },
  extraReducers: {},
});

export const useGlobalActions = () => {
  const dispatch = useDispatch();

  const handleSetUserInfo = (userInfo) => {
    dispatch(GlobalSlice.actions.setUserInfo(userInfo));
  };

  const handleSetLoading = (isLoading) => {
    dispatch(GlobalSlice.actions.setIsLoading(isLoading));
  };

  const handleSetError = (error) => {
    dispatch(GlobalSlice.actions.setError(error));
  };

  return {
    handleSetUserInfo,
    handleSetLoading,
    handleSetError,
  };
};

export default GlobalSlice.reducer;
