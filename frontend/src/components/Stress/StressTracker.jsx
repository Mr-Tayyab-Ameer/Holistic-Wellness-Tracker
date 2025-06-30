import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
export default function StressTracker() {
  const [stressEntries, setStressEntries] = useState([]);
  const [formData, setFormData] = useState({
    stressLevel: 5,
    factors: '',
    notes: '',
    copingStrategies: ''
  });

  const token = localStorage.getItem('token');

  const fetchStressHistory = useCallback(async () => {
    try {
      const res = await axios.get('/api/stress/history', {
        headers: { token }
      });
      setStressEntries(res.data.entries);
    } catch (err) {
      console.error('Error fetching stress history:', err.response?.data || err.message);
      toast.error('Failed to fetch stress history.');
    }
  }, [token]);

  useEffect(() => {
    fetchStressHistory();
  }, [fetchStressHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEntry = {
        stressLevel: formData.stressLevel,
        factors: formData.factors.split(',').map(f => f.trim()),
        notes: formData.notes,
        copingStrategies: formData.copingStrategies
          ? formData.copingStrategies.split(',').map(c => c.trim())
          : []
      };

      await axios.post('/api/stress/log', newEntry, {
        headers: { token }
      });

      toast.success('Stress entry logged successfully!');
      setFormData({ stressLevel: 5, factors: '', notes: '', copingStrategies: '' });
      fetchStressHistory();
    } catch (err) {
      console.error('Error logging stress:', err.response?.data || err.message);
      toast.error('Error logging stress entry.');
    }
  };

  const getStressColor = (level) => {
    if (level <= 3) return 'bg-green-100 text-green-800';
    if (level <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRecommendationForLevel = (level) => {
    if (level > 7) {
      return [
        "Practice deep breathing exercises 3 times daily",
        "Consider scheduling a therapist appointment",
        "Reduce caffeine intake",
        "Prioritize 7-9 hours of sleep"
      ];
    } else if (level > 5) {
      return [
        "Try a 10-minute meditation session",
        "Go for a 30-minute walk in nature",
        "Practice progressive muscle relaxation",
        "Journal about your stressors"
      ];
    } else {
      return [
        "Maintain your healthy habits",
        "Practice gratitude journaling",
        "Stay physically active",
        "Connect with friends and family"
      ];
    }
  };
const navigate = useNavigate();
  return (
    <div className="mx-auto md:mx-60">
      <h1 className="text-3xl font-bold text-primary mb-6">Stress Management</h1>
<div className="flex justify-end">
  <button
    type="button"
    onClick={() => setTimeout(() => {
        navigate('/emotion'); // 
      }, 3000)}
    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition duration-200"
  >
    Get Recommendation from Web
  </button>
</div>
      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Log Stress Level</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.stressLevel}
              onChange={(e) => setFormData({ ...formData, stressLevel: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span className="text-lg font-medium">{formData.stressLevel}</span>
              <span>High</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Factors (comma separated)</label>
            <input
              type="text"
              value={formData.factors}
              onChange={(e) => setFormData({ ...formData, factors: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Work, Family, Health"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="How are you feeling?"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coping Strategies (comma separated)</label>
            <input
              type="text"
              value={formData.copingStrategies}
              onChange={(e) => setFormData({ ...formData, copingStrategies: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Meditation, Exercise, Journaling"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition duration-200"
          >
            Log Stress Entry
          </button>
          <br />

        </form>
      </div>

      {/* Stress History with Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Stress History with Recommendations</h2>
        <div className="space-y-6">
          {stressEntries.map((entry) => (
            <div key={entry._id} className="border-l-4 border-gray-200 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStressColor(entry.stressLevel)}`}
                  >
                    Level {entry.stressLevel}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <div className="text-sm text-gray-500">{entry.factors.join(', ')}</div>
              </div>
              {entry.notes && (
                <p className="mt-1 text-sm text-gray-700">{entry.notes}</p>
              )}
              {/* Recommendations */}
              <div className="mt-2 text-sm text-primary">
                <p className="font-semibold mb-1">Recommendations:</p>
                <ul className="list-disc list-inside ml-4">
                  {getRecommendationForLevel(entry.stressLevel).map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
