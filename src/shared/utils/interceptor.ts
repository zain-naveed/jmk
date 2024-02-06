import axios from "axios";
import { store } from "../redux/store";
import { BaseURL } from "./endpoints";
import { resetUser } from "shared/redux/reducers/userSlice";
export const HTTP_CLIENT = axios.create({
  baseURL: BaseURL,
  timeout: 30000,
});
const setupAxios = () => {
  HTTP_CLIENT.interceptors.request.use(
    (config: any) => {
      const token = store.getState().root?.user?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );
};
HTTP_CLIENT.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err?.response?.status === 401) {
      const { user } = store.getState().root;
      if (user?.token) {
        store.dispatch(resetUser());
        window.location.reload();
      }
    }
    return Promise.reject(err);
  }
);
export const initialConfig = () => {
  setupAxios();
};

initialConfig();
