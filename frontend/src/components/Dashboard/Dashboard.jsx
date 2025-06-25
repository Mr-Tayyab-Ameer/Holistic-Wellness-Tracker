import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { Bar, Line } from "react-chartjs-2";
import { toast } from 'react-toastify';
import { format, startOfWeek, endOfWeek, addWeeks, parseISO } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { backendUrl } = useContext(AppContext);
  const token = localStorage.getItem("token");
  
  const [dashboardData, setDashboardData] = useState({
    fitnessSummary: 0,
    nutritionSummary: 0,
    stressSummary: 0,
  });

  const [selectedWeek, setSelectedWeek] = useState('');
  const [weekOptions, setWeekOptions] = useState([]);

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [{
      label: "Activities (minutes)",
      data: [],
      backgroundColor: "rgba(97, 5, 5, 1)",
    }]
  });

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [{
      label: "Calories Burned",
      data: [],
 borderColor: "rgba(97, 5, 5, 1)",
        backgroundColor: "rgba(97, 5, 5, 0.5)",
      tension: 0.4,
    }]
  });

  const generateWeekOptions = (activities) => {
    if (!activities.length) return [];
    
    const sortedDates = activities.map(a => new Date(a.date)).sort((a, b) => a - b);
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];
    
    const weeks = [];
    let currentWeekStart = startOfWeek(firstDate, { weekStartsOn: 1 });
    
    while (currentWeekStart <= lastDate) {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      weeks.push({
        value: currentWeekStart.toISOString(),
        label: `${format(currentWeekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
      });
      currentWeekStart = addWeeks(currentWeekStart, 1);
    }
    
    return weeks;
  };

  const updateChartsData = (activities) => {
    const barData = {
      labels: activities.map(activity => 
        format(new Date(activity.date), 'MMM d')
      ),
      datasets: [{
        label: "Activities (minutes)",
        data: activities.map(activity => activity.duration),
             backgroundColor: "rgba(97, 5, 5, 1)",
        activityTypes: activities.map(activity => activity.activityType),
      }]
    };

    const lineData = {
      labels: activities.map(activity => 
        format(new Date(activity.date), 'MMM d')
      ),
      datasets: [{
        label: "Calories Burned",
        data: activities.map(activity => activity.caloriesBurned),
        borderColor: "rgba(97, 5, 5, 1)",
        backgroundColor: "rgba(97, 5, 5, 0.5)",
        tension: 0.4,
      }]
    };

    setBarData(barData);
    setLineData(lineData);
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      console.log("No token available, please login again");
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/dashboard`, {
        headers: { token },
      });
      setDashboardData({
        fitnessSummary: res.data.totalFitnessActivities,
        nutritionSummary: res.data.averageCalories,
        stressSummary: res.data.averageStressLevel,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/fitness', {
          headers: { token }
        });
        
        const options = generateWeekOptions(data);
        setWeekOptions(options);
        if (options.length > 0 && !selectedWeek) {
          setSelectedWeek(options[options.length - 1].value);
        }
        
        const filteredActivities = data.filter(activity => {
          if (!selectedWeek) return true;
          const activityDate = parseISO(activity.date);
          const weekStart = parseISO(selectedWeek);
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          return activityDate >= weekStart && activityDate <= weekEnd;
        });

        const sortedActivities = [...filteredActivities].sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );
        
        updateChartsData(sortedActivities);
      } catch (error) {
        console.error('Failed to fetch activities', error);
        toast.error('Error fetching activities');
      }
    };

    fetchActivities();
  }, [token, selectedWeek, backendUrl]);

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataset = context.dataset;
            if (dataset && dataset.activityTypes) {
              const activityType = dataset.activityTypes[context.dataIndex];
              return `${activityType}: ${context.parsed.y} minutes`;
            }
            return `${context.parsed.y} minutes`;
          }
        }
      }
    }
  };

  return (
    <div className="mx-auto md:px-10 lg:px-20 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center md:text-left">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <h3 className="text-lg font-semibold text-gray-800">Fitness Summary</h3>
          <p className="mt-2 text-gray-600">{dashboardData.fitnessSummary} activities this week</p>
          <p className="text-primary mt-4 font-medium cursor-pointer">View details →</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <h3 className="text-lg font-semibold text-gray-800">Nutrition Summary</h3>
          <p className="mt-2 text-gray-600">{dashboardData.nutritionSummary} avg calories/day</p>
          <p className="text-primary mt-4 font-medium cursor-pointer">View details →</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <h3 className="text-lg font-semibold text-gray-800">Stress Level</h3>
          <p className="mt-2 text-gray-600">Average: {dashboardData.stressSummary}/10</p>
          <p className="text-primary mt-4 font-medium cursor-pointer">View details →</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-center md:text-left">
            Weekly Overview
          </h2>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="block w-48 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            {weekOptions.map((week) => (
              <option key={week.value} value={week.value}>
                {week.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-md p-4">
            <Bar data={barData} options={options} />
          </div>
          <div className="h-64 bg-gray-100 rounded-md p-4">
            <Line data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
}