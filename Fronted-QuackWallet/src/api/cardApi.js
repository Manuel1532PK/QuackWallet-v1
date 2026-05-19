import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Ajusta según tu URL

export const cardApi = {
  getCards: (userId) => 
    axios.get(`${API_URL}/cards/user/${userId}`, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),

  addCard: (userId, cardData) => 
    axios.post(`${API_URL}/cards/create/${userId}`, cardData, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),

  updateCard: (cardId, cardData) => 
    axios.put(`${API_URL}/cards/${cardId}/update`, cardData, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }),

  deleteCard: (cardId) => 
    axios.delete(`${API_URL}/cards/${cardId}/delete`, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
};