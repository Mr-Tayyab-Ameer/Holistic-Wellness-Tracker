import { Link, NavLink } from 'react-router-dom'
import fitnessIcon from '../assets/fitness_icon.svg'
import nutritionIcon from '../assets/nutrition_icon.svg'
import stressIcon from '../assets/stress_icon.svg'

export default function Home() {
   const isLoggedIn = localStorage.getItem('token')
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-primary mb-6">Holistic Wellness Tracker</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Track your fitness, nutrition, and stress levels in one place to achieve balanced well-being.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
        <NavLink to="/fitness" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="text-blue-500 text-4xl mb-4"><img src={fitnessIcon} alt="" /></div>
          <h3 className="text-xl font-semibold mb-2">Fitness Tracking</h3>
          <p className="text-gray-600">Log workouts and monitor progress</p>
        </NavLink>
        <NavLink to="/nutrition" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="text-green-500 text-4xl mb-4"><img src={nutritionIcon} alt="" /></div>
          <h3 className="text-xl font-semibold mb-2">Nutrition Log</h3>
          <p className="text-gray-600">Track meals and nutritional intake</p>
        </NavLink>
        <NavLink to="/stress" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="text-orange-500 text-4xl mb-4"><img src={stressIcon} alt="" /></div>
          <h3 className="text-xl font-semibold mb-2">Stress Management</h3>
          <p className="text-gray-600">Monitor and reduce stress levels</p>
        </NavLink>
      </div>
 {!isLoggedIn && (
      <div className="space-x-4">
        <Link 
          to="/register" 
          className="bg-primary text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-primaryhover transition"
        >
          Get Started
        </Link>
        <Link 
          to="/login" 
          className="bg-white text-primary px-6 py-3 rounded-md text-lg font-medium border border-primary hover:bg-primary hover:text-white transition"
        >
          Login
        </Link>
      </div>
       )}
    </div>

  )
}