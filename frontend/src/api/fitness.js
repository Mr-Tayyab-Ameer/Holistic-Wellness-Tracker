import axios from 'axios';

const API_URL = '/api/fitness';

// Get all fitness activities
const getActivities = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Add new activity
const addActivity = async (activityData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, activityData, config);
  return response.data;
};

// Delete activity
const deleteActivity = async (activityId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${activityId}`, config);
  return response.data;
};

const fitnessService = {
  getActivities,
  addActivity,
  deleteActivity,
};

export default fitnessService;