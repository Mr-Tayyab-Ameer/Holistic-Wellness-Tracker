import { useEffect, useState } from 'react';
import adminApi from '../adminApi';

function AdminUserTable() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '' });

  const fetchUsers = () => {
    adminApi.get('/users').then(res => setUsers(res.data));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditData({ name: user.name, email: user.email });
  };

  const handleUpdate = async () => {
    await adminApi.put(`/users/${editingId}`, editData);
    setEditingId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await adminApi.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <h3>Manage Users</h3>
      {users.map(user => (
        <div key={user._id}>
          {editingId === user._id ? (
            <>
              <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
              <input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
              <button onClick={handleUpdate}>Save</button>
            </>
          ) : (
            <>
              <span>{user.name} - {user.email}</span>
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminUserTable;
