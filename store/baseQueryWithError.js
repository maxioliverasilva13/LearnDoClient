import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { GlobalSlice } from "../store/slices/GlobalSlice";
import store from "./store";
import { prepareHeaders } from "utils/prepareHeaders";
import { toast } from "react-toastify";

export const baseUrl = "https://learndo-production.up.railway.app";

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: prepareHeaders,
});


const baseQueryWithError = async (args, api, extraOptions) => {
  const result = baseQuery(args, api, extraOptions);
  result
    ?.then((data) => {
      let error = null;
      if (data?.error) {
        error = data?.error?.data?.message;
      }
      if (data?.ok == false) {
        error = data?.message;
      }
      if (error) {
        toast.error(error, {
          theme: "colored",
        });
      }
    })
    ?.catch((e) => {
      store.dispatch(
        GlobalSlice.actions.setError(e?.message || "Internal error")
      );
    });
  return result;
};

export default baseQueryWithError;
