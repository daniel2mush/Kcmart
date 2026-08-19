import axios from "axios";

// const DEFAULT_BASE_URL = "https://kcmart.fastapicloud.dev/";

const BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API
  // DEFAULT_BASE_URL;

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;