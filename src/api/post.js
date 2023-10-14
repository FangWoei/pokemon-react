import axios from "axios";
import { API_URL } from "./data";

export const fetchPosts = async () => {
  const response = await axios.get(API_URL + "/post");
  return response.data;
};

export const getPost = async (id) => {
  const response = await axios.get(API_URL + "/post/" + id);
  return response.data;
};

export const addPosts = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/post/",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const uploadPostImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios({
    method: "POST",
    url: API_URL + "/images",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
};

export const deletePost = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/post/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
