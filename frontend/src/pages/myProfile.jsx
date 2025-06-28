// src/pages/MyProfile.jsx
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

// Dietary Restrictions Data (unchanged)
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

export default function MyProfile() {
  const { backendUrl } = useContext(AppContext);

  // === Existing state ===
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // === New state for profile editing ===
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Fetch profile and prefill edit form
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const { data } = await axios.get(`${backendUrl}/api/auth/profile`, {
        headers: { token }
      });
      setUser(data.userData);
      setEditName(data.userData.name);
      setEditEmail(data.userData.email);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [backendUrl]);

  // === Profile update handler ===
  const handleProfileUpdate = async () => {
    setUpdatingProfile(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${backendUrl}/api/auth/profile`,
        { name: editName, email: editEmail, currentPassword, newPassword },
        { headers: { token } }
      );
      toast.success('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      await fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // === Existing handlers ===
  const handleAddRestriction = async () => {
    if (newRestriction.trim() === '') {
      toast.warning('Please select a dietary restriction.');
      return;
    }
    setAddLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.warning('No token found. Please login.');

      const updated = [...(user.healthData?.dietaryRestrictions || []), newRestriction.trim()];
      await axios.put(
        `${backendUrl}/api/auth/update-health`,
        { dietaryRestrictions: updated },
        { headers: { token } }
      );
      setNewRestriction('');
      await fetchProfile();
      toast.success('Dietary restriction added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update dietary restrictions');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteRestriction = async (r) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.warning('No token found. Please login.');

      const updated = user.healthData.dietaryRestrictions.filter(x => x !== r);
      await axios.put(
        `${backendUrl}/api/auth/update-health`,
        { dietaryRestrictions: updated },
        { headers: { token } }
      );
      setUser(u => ({ ...u, healthData: { ...u.healthData, dietaryRestrictions: updated } }));
      toast.success('Restriction removed!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete restriction');
    }
  };

  const handleEditData = async () => {
    if (!editData.age || !editData.weight || !editData.height || !editData.gender) {
      return toast.warning('Please fill out all fields.');
    }
    setEditDataLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.warning('No token found. Please login.');

      await axios.put(
        `${backendUrl}/api/auth/update-health-data`,
        { healthData: editData },
        { headers: { token } }
      );
      await fetchProfile();
      toast.success('Health data updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update health data');
    } finally {
      setEditDataLoading(false);
    }
  };

  const renderDietaryRestrictionsDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(o => !o)}
        className="w-full px-4 py-2 text-left border rounded-lg"
      >
        {newRestriction || 'Select Dietary Restriction'}
      </button>
      {isDropdownOpen && (
        <div className="absolute z-10 w-full max-h-60 overflow-auto bg-white border rounded-lg">
          {Object.entries(DIETARY_RESTRICTIONS).map(([category, items]) => (
            <div key={category} className="p-2">
              <h3 className="font-bold mb-1">{category}</h3>
              {items.map(({ name, icon }) => (
                <div
                  key={name}
                  onClick={() => {
                    setNewRestriction(name);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center p-1 hover:bg-gray-100 cursor-pointer"
                >
                  <span className="mr-2">{icon}</span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) return <div className="text-center mt-10">Loading…</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">My Profile</h1>

      {/* Profile Settings */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            value={editEmail}
            onChange={e => setEditEmail(e.target.value)}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />
<div className="relative">
  <input
    type={showCurrentPassword ? 'text' : 'password'}
    value={currentPassword}
    onChange={e => setCurrentPassword(e.target.value)}
    placeholder="Current Password"
    className="w-full border px-3 py-2 rounded pr-10"
  />
  <button
    type="button"
    onClick={() => setShowCurrentPassword(prev => !prev)}
    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 text-lg"
  >
    {showCurrentPassword ? '🙈' : '👁️'}
  </button>
</div>

<div className="relative">
  <input
    type={showNewPassword ? 'text' : 'password'}
    value={newPassword}
    onChange={e => setNewPassword(e.target.value)}
    placeholder="New Password (optional)"
    className="w-full border px-3 py-2 rounded pr-10"
    minLength={6}
  />
  <button
    type="button"
    onClick={() => setShowNewPassword(prev => !prev)}
    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 text-lg"
  >
    {showNewPassword ? '🙈' : '👁️'}
  </button>
</div>

        
          <button
            onClick={handleProfileUpdate}
            disabled={updatingProfile}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primaryhover disabled:opacity-50"
          >
            {updatingProfile ? 'Updating…' : 'Update Profile'}
          </button>
        </div>
      </div>

      {/* Existing Display of Name, Email, Health Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {user?.name && (
            <div className="flex justify-between">
              <span className="font-semibold">Name:</span>
              <span>{user.name}</span>
            </div>
          )}
          {user?.email && (
            <div className="flex justify-between">
              <span className="font-semibold">Email:</span>
              <span>{user.email}</span>
            </div>
          )}
          {user?.yourData && (
            <div className="mt-4">
              <span className="font-semibold block mb-2">Your Data:</span>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Age:</span><span>{user.yourData.age}</span></div>
                <div className="flex justify-between"><span>Weight:</span><span>{user.yourData.weight} kg</span></div>
                <div className="flex justify-between"><span>Height:</span><span>{user.yourData.height} cm</span></div>
                <div className="flex justify-between"><span>Gender:</span><span>{user.yourData.gender}</span></div>
                <div className="flex justify-between"><span>Fitness Goals:</span><span>{user.yourData.fitnessGoals}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Dietary Restrictions Section */}
        <div>
          <span className="font-semibold">Dietary Restrictions:</span>
          {user.healthData?.dietaryRestrictions?.length ? (
            <ul className="mt-2 space-y-2">
              {user.healthData.dietaryRestrictions.map((r, i) => (
                <li key={i} className="flex justify-between bg-gray-100 px-3 py-2 rounded-lg">
                  <span>{r}</span>
                  <button onClick={() => handleDeleteRestriction(r)} className="text-red-500">❌</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No restrictions added yet.</p>
          )}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Add Restriction</h2>
            {renderDietaryRestrictionsDropdown()}
            <button
              onClick={handleAddRestriction}
              disabled={addLoading || !newRestriction}
              className="mt-2 w-full bg-primary text-white py-2 rounded hover:bg-primaryhover disabled:opacity-50"
            >
              {addLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Your Data */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Edit Your Data</h2>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            value={editData.age}
            onChange={e => setEditData({ ...editData, age: e.target.value })}
            placeholder="Age"
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            value={editData.weight}
            onChange={e => setEditData({ ...editData, weight: e.target.value })}
            placeholder="Weight (kg)"
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            value={editData.height}
            onChange={e => setEditData({ ...editData, height: e.target.value })}
            placeholder="Height (cm)"
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            value={editData.gender}
            onChange={e => setEditData({ ...editData, gender: e.target.value })}
            placeholder="Gender"
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            value={editData.fitnessGoals}
            onChange={e => setEditData({ ...editData, fitnessGoals: e.target.value })}
            placeholder="Fitness Goals"
            className="px-4 py-2 border rounded-lg"
          />
          <button
            onClick={handleEditData}
            disabled={editDataLoading}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primaryhover disabled:opacity-50"
          >
            {editDataLoading ? 'Updating...' : 'Update Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
