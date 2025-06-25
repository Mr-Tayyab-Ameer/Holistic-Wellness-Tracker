import { useEffect, useState } from 'react';
import adminApi, { logoutAdmin } from '../adminApi';

function AdminList() {
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = () => {
    adminApi.get('/admins').then(res => setAdmins(res.data));
  };

  const deleteAdmin = async (id) => {
    await adminApi.delete(`/admins/${id}`);
    fetchAdmins();
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div>
      <h3>All Admins</h3>
      <button onClick={() => {
        logoutAdmin();
        window.location.href = '/admin/login';
      }}>Logout</button>
      <ul>
        {admins.map(admin => (
          <li key={admin._id}>
            {admin.name} - {admin.email}
            <button onClick={() => deleteAdmin(admin._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminList;