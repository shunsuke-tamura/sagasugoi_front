import axios from "axios";

export default () => {
  const axiosClient = axios.create({
    baseURL: "https://official-joke-api.appspot.com/jokes",
  });
  return axiosClient;
};
