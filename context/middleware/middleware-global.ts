import type { Middleware } from "@reduxjs/toolkit";

export const threads: Middleware = (storeAPI) => (dispatch) => async (action: any) => {
  return dispatch(action);
};
