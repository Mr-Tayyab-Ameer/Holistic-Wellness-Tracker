import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData(response.data.userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      
      <h3>Health Data</h3>
      <p>Age: {userData.healthData.age}</p>
      <p>Weight: {userData.healthData.weight}</p>
      <p>Height: {userData.healthData.height}</p>
      <p>Gender: {userData.healthData.gender}</p>
      <p>Fitness Goals: {userData.healthData.fitnessGoals}</p>
      <p>Dietary Restrictions: {userData.healthData.dietaryRestrictions.join(', ')}</p>
    </div>
  );
};

export default ProfilePage;
