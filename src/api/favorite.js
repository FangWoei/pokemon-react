import axios from "axios";

import { API_URL } from "./data";

export const fetchFavorite = async (token = "") => {
  const response = await axios({
    method: "GET",
    url: API_URL + "/favorite",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

export const getFavorite = async (id) => {
  const response = await axios.get(API_URL + "/favorite/" + id);
  return response.data;
};

export const createFavorite = async ({data = "", token = ""}) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/favorite",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deleteFavorite = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/favorite/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
