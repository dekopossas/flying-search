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

export const getAirports = async (url) => {
  const { data } = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "f77d7862f7msh306429f280db285p1f1fddjsnd80bcf7ef475", // Replace with your actual API key
    },
  });
  return data;
};
