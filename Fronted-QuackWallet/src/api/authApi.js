import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

// REGISTRAR USUARIO
export const registerUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, userData);
    return data;
  } catch (error) {
    console.error("Error en registerUser:", error);
    throw error;
  }
};

// LOGIN USUARIO
export const loginUser = async (correo, password) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, { correo, password });
    return data;
  } catch (error) {
    console.error("Error en loginUser:", error);
    throw error;
  }
};

// VERIFICAR CORREO - CORREGIDO (usar query parameter)
export const verifyEmail = async (token) => {
  try {
    const { data } = await axios.get(`${API_URL}/verify?token=${token}`); // ← CAMBIO AQUÍ
    return data;
  } catch (error) {
    console.error("Error en verifyEmail:", error);
    throw error;
  }
};

// REENVIAR CORREO DE VERIFICACIÓN
export const resendVerificationEmail = async (correo) => {
  try {
    const { data } = await axios.post(`${API_URL}/resend-verification`, { correo });
    return data;
  } catch (error) {
    console.error("Error en resendVerificationEmail:", error);
    throw error;
  }
};