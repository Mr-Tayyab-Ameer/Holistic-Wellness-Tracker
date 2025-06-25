import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { backendUrl } = useContext(AppContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRestriction, setNewRestriction] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editData, setEditData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    fitnessGoals: ''
  });
  const [editDataLoading, setEditDataLoading] = useState(false);

  // Function to fetch profile data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login.');
        setLoading(false);
        return;
      }

      const { data } = await axios.get(backendUrl + '/api/auth/profile', {
        headers: { token },
      });

      setUser(data.userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [backendUrl]);

  // Handle adding a new dietary restriction
  const handleAddRestriction = async () => {
    if (newRestriction.trim() === '') {
      toast.warning('Please provide a dietary restriction.');
      return;
    }

    setAddLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warning('No token found. Please login.');
        return;
      }

      const updatedRestrictions = [...(user?.healthData?.dietaryRestrictions || []), newRestriction.trim()];

      // Update dietary restrictions on the backend
      await axios.put(
        backendUrl + '/api/auth/update-health',
        { dietaryRestrictions: updatedRestrictions },
        { headers: { token } }
      );

      fetchProfile();
      setNewRestriction('');
      toast.success('Dietary restriction added successfully!');
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to update dietary restrictions");
      toast.error(error.response?.data?.message || "Failed to update dietary restrictions");
    } finally {
      setAddLoading(false);
    }
  };

  // Handle deleting a dietary restriction
  const handleDeleteRestriction = async (restrictionToDelete) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warning('No token found. Please login.');
        return;
      }

      const updatedRestrictions = user?.healthData?.dietaryRestrictions?.filter(r => r !== restrictionToDelete);

      await axios.put(
        backendUrl + '/api/auth/update-health',
        { dietaryRestrictions: updatedRestrictions },
        { headers: { token } }
      );

      setUser({
        ...user,
        healthData: {
          ...user.healthData,
          dietaryRestrictions: updatedRestrictions,
        },
      });

      toast.success('Dietary restriction deleted successfully!');
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to delete dietary restriction");
      toast.error(error.response?.data?.message || "Failed to delete dietary restriction");
    }
  };

  // Handle updating health data (age, weight, height, gender, fitness goals)
  const handleEditData = async () => {
    if (!editData.age || !editData.weight || !editData.height || !editData.gender) {
      toast.warning('Please fill out all fields.');
      return;
    }

    setEditDataLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warning('No token found. Please login.');
        return;
      }

      await axios.put(
        backendUrl + '/api/auth/update-health-data',
        { healthData: editData },
        { headers: { token } }
      );

      fetchProfile();
      toast.success('Health data updated successfully!');
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to update health data");
      toast.error(error.response?.data?.message || "Failed to update health data");
    } finally {
      setEditDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Your Data */}
        <div className="space-y-4">
          {user?.name && (
            <div className="flex items-center justify-between">
              <span className="font-semibold">Name:</span>
              <span>{user.name}</span>
            </div>
          )}

          {user?.email && (
            <div className="flex items-center justify-between">
              <span className="font-semibold">Email:</span>
              <span>{user.email}</span>
            </div>
          )}

          {user?.yourData && (
            <div className="flex flex-col mt-4">
              <span className="font-semibold mb-2">Your Data:</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Age:</span>
                  <span>{user.yourData.age}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Weight:</span>
                  <span>{user.yourData.weight} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Height:</span>
                  <span>{user.yourData.height} cm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gender:</span>
                  <span>{user.yourData.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fitness Goals:</span>
                  <span>{user.yourData.fitnessGoals}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Dietary Restrictions */}
        <div className="space-y-4">
          <div className="flex flex-col mt-4">
            <span className="font-semibold mb-2">Dietary Restrictions:</span>
            {user?.healthData?.dietaryRestrictions?.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {user.healthData.dietaryRestrictions.map((restriction, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
                    <span>{restriction}</span>
                    <button
                      onClick={() => handleDeleteRestriction(restriction)}
                      className="text-primary hover:text-primaryhover text-sm"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No restrictions added yet.</p>
            )}
          </div>

          {/* Add Dietary Restriction Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Add Dietary Restriction</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={newRestriction}
                onChange={(e) => setNewRestriction(e.target.value)}
                placeholder="Enter Dietary Restriction"
                className="w-full sm:w-4/5 px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleAddRestriction}
                disabled={addLoading}
                className="px-4 py-1 bg-primary hover:bg-primaryhover text-white rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {addLoading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Your Data Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Edit Your Data</h2>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            value={editData.age}
            onChange={(e) => setEditData({ ...editData, age: e.target.value })}
            placeholder="Age"
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            value={editData.weight}
            onChange={(e) => setEditData({ ...editData, weight: e.target.value })}
            placeholder="Weight (kg)"
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            value={editData.height}
            onChange={(e) => setEditData({ ...editData, height: e.target.value })}
            placeholder="Height (cm)"
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            value={editData.gender}
            onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
            placeholder="Gender"
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            value={editData.fitnessGoals}
            onChange={(e) => setEditData({ ...editData, fitnessGoals: e.target.value })}
            placeholder="Fitness Goals"
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />

          <button
            onClick={handleEditData}
            disabled={editDataLoading}
            className="px-6 py-2 bg-primary hover:bg-primaryhover text-white rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {editDataLoading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default MyProfile;
