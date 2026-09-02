/* Este archivo será el único encargado de comunicarse con Express. */

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    config.headers["x-user-id"] = usuario.id_usuario;
    config.headers["x-user-role"] = usuario.rol;
  }

  return config;
});

export default api;

const BASE_URL = 'http://localhost:3000/api'; // Ajusta a la URL de tu server

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token'); // Si usas Auth
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error en la petición al servidor');
  }

  return response.json();
};