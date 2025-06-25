import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FitnessTracker() {
  const { backendUrl } = useContext(AppContext);

  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    type: 'Running',
    duration: '',
    calories: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/fitness', {
          headers: { token }
        });
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities', error);
        toast.error('Error fetching activities');
      }
    };

    fetchActivities();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + '/api/fitness',
        {
          activityType: formData.type,
          duration: parseInt(formData.duration),
          caloriesBurned: parseInt(formData.calories),
        },
        {
          headers: { token }
        }
      );
      setActivities([data, ...activities]);
      setFormData({ type: 'Running', duration: '', calories: '' });
      toast.success('Activity added successfully!');
    } catch (error) {
      console.error('Failed to add activity', error);
      toast.error('Error adding activity');
    }
  };

  const handleDelete = async (activityId) => {
    try {
      await axios.delete(backendUrl + '/api/fitness/' + activityId, {
        headers: { token }
      });
      setActivities(activities.filter(activity => activity._id !== activityId));
      toast.success('Activity deleted!');
    } catch (error) {
      console.error('Failed to delete activity', error);
      toast.error('Error deleting activity');
    }
  };

  return (
    <div className="mx-auto md:mx-60">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-primary mb-4">Fitness Tracker</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Activity</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:primary"
            >
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Swimming">Swimming</option>
              <option value="Yoga">Yoga</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition duration-200"
          >
            Add Activity
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Activity History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.activityType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.duration} mins</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.caloriesBurned} cal</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date.split('T')[0]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(activity._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
