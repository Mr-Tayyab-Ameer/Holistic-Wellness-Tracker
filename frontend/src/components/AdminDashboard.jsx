import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchAdmin, setSearchAdmin] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [editing, setEditing] = useState({ type: null, id: null });
  const [editData, setEditData] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const [adminRes, userRes] = await Promise.all([
        axios.get(`/api/admin/admins?search=${encodeURIComponent(searchAdmin)}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/api/admin/users?search=${encodeURIComponent(searchUser)}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAdmins(adminRes.data);
      setUsers(userRes.data);
    } catch {
      toast.error('Failed to fetch data');
    }
  }, [searchAdmin, searchUser]);

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
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(
        `/api/admin/${editing.type}s/${editing.id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Updated successfully');
      setEditing({ type: null, id: null });
      fetchData();
    } catch {
      toast.error('Update failed');
    }
  };

  const deleteRecord = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    const token = localStorage.getItem('adminToken');
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    setTimeout(() => navigate('/admin/login'), 1000);
  };

  const renderTable = (data, type) => (
    <table className="w-full table-auto border border-gray-300 my-6">
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
            <td className="border p-2">{record.role || 'user'}</td>
            <td className="border p-2 space-x-2">
              {editing.id === record._id ? (
                <button onClick={saveEdit} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
              ) : (
                <button onClick={() => startEdit(type, record)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
              )}
              <button
                onClick={() => deleteRecord(type, record._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/admin/register"
          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primaryhover"
        >Register Admin</Link>
        <button
          onClick={handleLogout}
          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primaryhover"
        >Logout</button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Admins</h2>
        <input
          type="text"
          placeholder="Search Admins..."
          value={searchAdmin}
          onChange={e => setSearchAdmin(e.target.value)}
          className="mb-2 border px-3 py-2 w-full rounded"
        />
        {renderTable(admins, 'admin')}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Users</h2>
        <input
          type="text"
          placeholder="Search Users..."
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          className="mb-2 border px-3 py-2 w-full rounded"
        />
        {renderTable(users, 'user')}
      </div>
    </div>
  );
};

export default AdminDashboard;
