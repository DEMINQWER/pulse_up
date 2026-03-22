import axios from 'axios';
const API_URL = 'http://your-server.com/api/pulse';

export const updatePulseUser = async (userId, username, coordinates) => {
  try {
    const res = await axios.post(`${API_URL}/update`, { userId, username, coordinates });
    return res.data.user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getNearbyUsers = async (lat, lng, radius = 1000) => {
  try {
    const res = await axios.get(`${API_URL}/nearby`, { params: { lat, lng, radius } });
    return res.data.users || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};