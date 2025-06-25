import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateHealthData = () => {
  const [healthData, setHealthData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    fitnessGoals: '',
    dietaryRestrictions: [],
  });

  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      const userId = jwt_decode(token).id;

      try {
        const response = await axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
        setHealthData(response.data.userData.healthData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHealthData({ ...healthData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = jwt_decode(token).id;

    try {
      const response = await axios.put(
        '/api/auth/update-health-data',
        { userId, healthData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage('Health data updated successfully!');
    } catch (error) {
      setMessage('Error updating health data');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Update Health Data</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Age: </label>
          <input
            type="number"
            name="age"
            value={healthData.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Weight: </label>
          <input
            type="number"
            name="weight"
            value={healthData.weight}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Height: </label>
          <input
            type="number"
            name="height"
            value={healthData.height}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender: </label>
          <select
            name="gender"
            value={healthData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Fitness Goals: </label>
          <input
            type="text"
            name="fitnessGoals"
            value={healthData.fitnessGoals}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Dietary Restrictions: </label>
          <input
            type="text"
            name="dietaryRestrictions"
            value={healthData.dietaryRestrictions}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Health Data</button>
      </form>
    </div>
  );
};

export default UpdateHealthData;
