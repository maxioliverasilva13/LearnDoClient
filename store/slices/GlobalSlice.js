import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState = {
  userInfo: null,
};

export const GlobalSlice = createSlice({
  name: "GlobalSlice",
  initialState,
  reducers: {
    setUserInfo(state, { payload }) {
      state.userInfo = payload;
    },
  },
  extraReducers: {},
});

export const useGlobalActions = () => {
  const dispatch = useDispatch();

  const handleSetUserInfo = (userInfo) => {
    dispatch(GlobalSlice.actions.setUserInfo(userInfo));
  };

  return {
    handleSetUserInfo,
  };
};

export default GlobalSlice.reducer;
