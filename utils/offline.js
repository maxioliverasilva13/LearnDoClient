const IS_ONLINE_KEY = "ISONLINE";
const USER_INFO_KEY = "user_info";

export const handleSetIsOnline = () => {
  if (typeof window !== "undefined")
    localStorage.setItem(IS_ONLINE_KEY, "true");
};

export const handleSetIsOffline = () => {
  if (typeof window !== "undefined")
    localStorage.setItem(IS_ONLINE_KEY, "false");
};

export const handleGetIsOnline = () => {
  if (typeof window !== "undefined") localStorage.getItem(IS_ONLINE_KEY);
};

export const handleChangeOnlineStatusStorage = (value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(IS_ONLINE_KEY, value);
  }
};

export const handleStorageUserInfo = (userInfo) => {
    console.log("xd1");
  if (typeof window !== "undefined") {
    console.log("xd2");
    const uinfo = JSON.stringify(userInfo);
    localStorage.setItem(USER_INFO_KEY, uinfo);
  }
};

export const handleClearUserInfo = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_INFO_KEY);
  }
};

export const getUserInfoFromStorage = () => {
  if (typeof window !== "undefined") {
    const uinfo = JSON.parse(localStorage.getItem(USER_INFO_KEY)) || null;
    return uinfo;
  }
};
