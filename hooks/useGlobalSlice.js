import { useEffect } from "react";
import { useSelector } from "react-redux";
import appRoutes from "routes/appRoutes";
import { useGlobalActions } from "store/slices/GlobalSlice";
import {
  handleChangeOnlineStatusStorage,
  handleStorageUserInfo,
} from "utils/offline";
import { clearToken } from "utils/tokenUtils";

const useGlobalSlice = () => {
  const { userInfo, isLoading, error, isOnline } = useSelector(
    (state) => state.GlobalSlice
  );
  const rol = userInfo?.type;

  useEffect(() => {
    if (userInfo) {
      handleStorageUserInfo(userInfo);
    }
  }, [userInfo]);

  const { handleSetUserInfo, handleSetOnlineStatus, handleSetLoading } =
    useGlobalActions();

  const handleLogout = () => {
    clearToken();
    window.location.href = appRoutes.landing();
  };

  const changeOnlineStatus = (value) => {
    handleSetOnlineStatus(value);
    handleChangeOnlineStatusStorage(`${value}`);
  };

  return {
    userInfo,
    isLoading,
    handleSetLoading,
    handleSetUserInfo,
    handleLogout,
    rol,
    isOnline,
    error,
    changeOnlineStatus,
  };
};

export default useGlobalSlice;
