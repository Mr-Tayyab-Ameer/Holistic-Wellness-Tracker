import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
  }
});

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
};

export default adminApi;
