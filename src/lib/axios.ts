import axios from "axios";

export default () => {
  const axiosClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return axiosClient;
};
