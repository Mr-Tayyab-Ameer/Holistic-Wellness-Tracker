// All imports remain the same
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState({ type: null, id: null });
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [ownProfile, setOwnProfile] = useState(null);
  const [ownEditMode, setOwnEditMode] = useState(false);
  const [ownEditData, setOwnEditData] = useState({ name: '', email: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const fetchData = useCallback(async () => {
    try {
      const [adminRes, userRes, profileRes] = await Promise.all([
        axios.get(`/api/admin/admins`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setAdmins(adminRes.data);
      setUsers(userRes.data);
      setOwnProfile(profileRes.data);
      setOwnEditData({ name: profileRes.data.name, email: profileRes.data.email });
    } catch {
      toast.error('Failed to fetch data');
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startEdit = (type, record) => {
    setEditing({ type, id: record._id });
    setEditData({ name: record.name, email: record.email });
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    if (!editData.name.trim() || !editData.email.includes('@')) {
      toast.error('Please enter a valid name and email');
      return;
    }
    try {
      await axios.put(`/api/admin/${editing.type}s/${editing.id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Updated successfully');
      setEditing({ type: null, id: null });
      fetchData();
    } catch(error) {
      const message = error.response?.data?.error || 'Update failed';
    toast.error(message);
    }
  };

  const deleteRecord = async (type, id) => {
    if (type === 'admin' && id === ownProfile?._id) {
      toast.error("You can't delete your own admin account.");
      return;
    }
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`/api/admin/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Deleted successfully');
      fetchData();
    } catch {
      toast.error('Deletion failed');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    try {
      await axios.put('/api/admin/update-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password updated successfully');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    setTimeout(() => navigate('/admin/login'), 1000);
  };

  const handleOwnEditChange = (field, value) => {
    setOwnEditData(prev => ({ ...prev, [field]: value }));
  };

  const saveOwnProfile = async () => {
    if (!ownEditData.name.trim() || !ownEditData.email.includes('@')) {
      toast.error('Please enter a valid name and email');
      return;
    }
    try {
      await axios.put('/api/admin/profile', ownEditData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated');
      setOwnEditMode(false);
      fetchData();
    } catch(error) {
      const message = error.response?.data?.error || 'Profile Update failed';
    toast.error(message);
    }
  };

  const renderTable = (data, type) => (
    <div className="overflow-y-auto max-h-96">
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(record => (
            <tr key={record._id} className="text-center">
              <td className="border p-2">
                {editing.id === record._id ? (
                  <input
                    value={editData.name}
                    onChange={e => handleEditChange('name', e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : record.name}
              </td>
              <td className="border p-2">
                {editing.id === record._id ? (
                  <input
                    value={editData.email}
                    onChange={e => handleEditChange('email', e.target.value)}
                    className="border p-1 rounded"
                  />
                ) : record.email}
              </td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded-full text-white ${record.role === 'admin' ? 'bg-blue-500' : 'bg-green-500'}`}>
                  {record.role}
                </span>
              </td>
              <td className="border p-2 space-x-2">
                {editing.id === record._id ? (
                  <>
                    <button onClick={saveEdit} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                    <button onClick={() => setEditing({ type: null, id: null })} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(type, record)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    <button
                      onClick={() => deleteRecord(type, record._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Link to="/admin/register" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primaryhover">
            Register Admin
          </Link>
          <button onClick={() => setShowPasswordForm(prev => !prev)} className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600">
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>
        <button onClick={handleLogout} className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primaryhover">
          Logout
        </button>
      </div>

      {showPasswordForm && (
        <div className="bg-white shadow p-4 rounded mb-6 max-w-md mx-auto border border-gray-300">
          <h2 className="text-lg font-semibold mb-2">Change Password</h2>

          <div className="relative mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <div className="relative mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button onClick={handlePasswordChange} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Update Password
          </button>
        </div>
      )}

      {ownProfile && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">My Profile</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border p-2">
                    {ownEditMode ? (
                      <input
                        value={ownEditData.name}
                        onChange={(e) => handleOwnEditChange('name', e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    ) : ownProfile.name}
                  </td>
                  <td className="border p-2">
                    {ownEditMode ? (
                      <input
                        value={ownEditData.email}
                        onChange={(e) => handleOwnEditChange('email', e.target.value)}
                        className="border p-1 rounded w-full"
                      />
                    ) : ownProfile.email}
                  </td>
                  <td className="border p-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full">admin</span>
                  </td>
                  <td className="border p-2 space-x-2">
                    {ownEditMode ? (
                      <>
                        <button onClick={saveOwnProfile} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                        <button onClick={() => setOwnEditMode(false)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setOwnEditMode(true)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Admins</h2>
        {renderTable(admins, 'admin')}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Users</h2>
        {renderTable(users, 'user')}
      </div>
    </div>
  );
};

export default AdminDashboard;
