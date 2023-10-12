import axios from "axios";

import { API_URL } from "./data";

export const fetchPokemons = async () => {
  const response = await axios.get(API_URL + "/pokemons");
  return response.data;
};

export const getPokemons = async (id) => {
  const response = await axios.get(API_URL + "/pokemons/" + id);
  return response.data;
};

export const addPokemons = async ({ data, token = "" }) => {
  const response = await axios({
    method: "POST",
    url: API_URL + "/pokemons",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const uploadPokemonImage = async (file) => {
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

export const updatePokemon = async ({ id, data, token = "" }) => {
  const response = await axios({
    method: "PUT",
    url: API_URL + "/pokemons/" + id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: data,
  });
  return response.data;
};

export const deletePokemon = async ({ id = "", token = "" }) => {
  const response = await axios({
    method: "DELETE",
    url: API_URL + "/pokemons/" + id,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};
