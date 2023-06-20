import { getToken } from "./tokenUtils";

export const prepareHeaders = (headers, { getState }) => {
  const token = getToken();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  if (token) {
    // include token in req header
    headers.set("Authorization", `bearer ${token}`);
    return headers;
  } else {
    // public path
    return headers;
  }
};
