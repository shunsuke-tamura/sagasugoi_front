import axios from "axios";

export default () => {
  const axiosClient = axios.create({
    baseURL: "http://localhost:4010/carps",
  });
  return axiosClient;
};
