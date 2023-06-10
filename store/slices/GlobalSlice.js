import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { getUserInfoFromStorage, handleGetIsOnline } from "utils/offline";

const initialState = {
  userInfo: getUserInfoFromStorage() || null,
  isLoading: false,
  error: null,
  isOnline: (handleGetIsOnline() || "true") === "true",
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
    },
    setOnline(state, {payload}) {
      state.isOnline = payload;
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

  const handleSetOnlineStatus = (value) => {
    dispatch(GlobalSlice.actions.setOnline(value));
  };

  const handleSetError = (error) => {
    dispatch(GlobalSlice.actions.setError(error));
  };

  return {
    handleSetUserInfo,
    handleSetLoading,
    handleSetError,
    handleSetOnlineStatus,
  };
};

export default GlobalSlice.reducer;
