import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

// Dietary Restrictions Data
const DIETARY_RESTRICTIONS = {
  'Metabolic & Endocrine Conditions': [
    { name: 'Type 1 Diabetes (Insulin-dependent)', icon: '💉' },
    { name: 'Type 2 Diabetes (Non-insulin dependent)', icon: '🩺' },
    { name: 'Gestational Diabetes', icon: '👶' },
    { name: 'Prediabetes/Insulin Resistance', icon: '⚠️' },
    { name: 'Hypoglycemia', icon: '📉' },
    { name: 'Metabolic Syndrome', icon: '🔬' }
  ],
  'Cardiovascular Conditions': [
    { name: 'Hypertension (High Blood Pressure)', icon: '❤️' },
    { name: 'Coronary Heart Disease', icon: '💓' },
    { name: 'High Cholesterol/Hyperlipidemia', icon: '📊' },
    { name: 'Heart Failure', icon: '🚑' }
  ],
  'Gastrointestinal Disorders': [
    { name: 'Celiac Disease (Autoimmune gluten intolerance)', icon: '🌾' },
    { name: 'Crohn\'s Disease', icon: '🔬' },
    { name: 'Ulcerative Colitis', icon: '🩺' },
    { name: 'Irritable Bowel Syndrome (IBS)', icon: '🚽' },
    { name: 'Gastroesophageal Reflux Disease (GERD)', icon: '🔥' }
  ],
  'Major Food Allergies': [
    { name: 'Dairy/Milk Allergy', icon: '🥛' },
    { name: 'Peanut Allergy', icon: '🥜' },
    { name: 'Tree Nut Allergy (Almonds, Walnuts, Cashews, etc.)', icon: '🌰' },
    { name: 'Shellfish Allergy (Crustaceans & Mollusks)', icon: '🦐' },
    { name: 'Egg Allergy', icon: '🥚' },
    { name: 'Fish Allergy', icon: '🐟' }
  ],
  'Food Intolerances': [
    { name: 'Lactose Intolerance', icon: '🥛' },
    { name: 'Gluten Sensitivity (Non-celiac)', icon: '🌾' },
    { name: 'Fructose Intolerance', icon: '🍎' },
    { name: 'FODMAP Intolerance', icon: '🥦' }
  ],
  'Religious & Cultural Dietary Laws': [
    { name: 'Halal (Islamic dietary requirements)', icon: '🕌' },
    { name: 'Kosher (Jewish dietary laws)', icon: '✡️' },
    { name: 'Hindu Vegetarian', icon: '🕉️' },
    { name: 'Jain Vegetarian (Strict vegan + no root vegetables)', icon: '🌱' }
  ],
  'Ethical & Lifestyle Diets': [
    { name: 'Lacto-Ovo Vegetarian', icon: '🥗' },
    { name: 'Strict Vegan', icon: '🌿' },
    { name: 'Pescatarian', icon: '🐟' },
    { name: 'Ketogenic Diet', icon: '🥑' },
    { name: 'Paleo Diet', icon: '🦴' }
  ],
  'Kidney & Liver Conditions': [
    { name: 'Chronic Kidney Disease', icon: '🫘' },
    { name: 'Kidney Stones', icon: '🪨' },
    { name: 'Liver Disease', icon: '🩺' }
  ],
  'Bone & Joint Conditions': [
    { name: 'Osteoporosis', icon: '🦴' },
    { name: 'Gout', icon: '🩺' }
  ]
};

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

  // State for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      toast.warning('Please select a dietary restriction.');
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

  // Render method for dietary restrictions dropdown
  const renderDietaryRestrictionsDropdown = () => {
    return (
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {newRestriction || 'Select Dietary Restriction'}
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
            {Object.entries(DIETARY_RESTRICTIONS).map(([category, restrictions]) => (
              <div key={category} className="p-2">
                <h3 className="font-bold text-primary mb-2 border-b">{category}</h3>
                {restrictions.map((restriction) => (
                  <div 
                    key={restriction.name} 
                    onClick={() => {
                      setNewRestriction(restriction.name);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    <span className="mr-2">{restriction.icon}</span>
                    <span>{restriction.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
            {renderDietaryRestrictionsDropdown()}
            <button
              onClick={handleAddRestriction}
              disabled={addLoading || !newRestriction}
              className="w-full mt-4 px-4 py-2 bg-primary hover:bg-primaryhover text-white rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {addLoading ? 'Adding...' : 'Add Dietary Restriction'}
            </button>
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
