import axios, { AxiosResponse, AxiosError } from "axios";

const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

publicAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    // response.data exactly equals { metadata, data } from backend
    // Type result as ApiResponse<any> to keep flexibility
    return response.data;
  },
  (error: AxiosError) => {
    // Return typed error response
    return Promise.reject(error?.response?.data || error);
  }
);

export default publicAxios;
