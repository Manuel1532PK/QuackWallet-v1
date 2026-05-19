import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Ajusta según tu configuración

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const userApi = {
  // Obtener perfil completo
  getCompleteProfile: (userId) => 
    api.get(`/users/${userId}/profile`),

  // Actualizar perfil (datos básicos)
  updateProfile: (userId, profileData) =>
    api.put(`/users/${userId}/profile`, profileData),

  // Actualizar imagen de perfil
  updateProfileImage: (userId, imageFile) => {
    const formData = new FormData();
    formData.append('imagen', imageFile);
    
    return api.put(`/users/${userId}/profile/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};