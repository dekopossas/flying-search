import axios from "axios";

// const token = await localStorage.getItem("token");
// console.log(" dentro da request token", token);

export const API = axios.create({
  baseURL: "http://localhost:3001",
});

export const getRequest = async (url, params) => {
  const { data } = await API.get(url, { params });
  return data;
};
