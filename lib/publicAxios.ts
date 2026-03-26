import axios from "axios";
import { IBackendRes } from "@/types/backend.type";

const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

publicAxios.interceptors.response.use(
  (response) => {
    // response.data chính là { metadata, data } từ backend
    // Trả nguyên gốc để component nhận đúng IBackendRes<T>
    return response.data as IBackendRes<unknown>;
  },
  (error) => {
    // error.response.data chính là IBackendErrorRes từ HttpExceptionFilter
    return Promise.reject(error?.response?.data || error);
  }
);

export default publicAxios;
