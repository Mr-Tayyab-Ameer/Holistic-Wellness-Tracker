import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

export default function NutritionTracker() {

  const { backendUrl } = useContext(AppContext)
  
  const [meals, setMeals] = useState([])
  const [formData, setFormData] = useState({
    foodItem: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    mealType: 'breakfast'
  })

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(backendUrl + '/api/nutrition', {
          headers: { token }
        })
        setMeals(res.data)
      } catch (error) {
        console.error('Error fetching meals:', error)
        toast.error('Failed to fetch meals.')
      }
    }
    fetchMeals()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        backendUrl + '/api/nutrition',
        {
          foodItem: formData.foodItem,
          calories: parseInt(formData.calories),
          protein: parseInt(formData.protein),
          carbs: parseInt(formData.carbs),
          fats: parseInt(formData.fats),
          mealType: formData.mealType
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            token 
          }
        }
      )

      if (res.status === 201 || res.status === 200) {
        const newMeal = res.data
        setMeals(prev => [newMeal, ...prev])
        setFormData({
          foodItem: '',
          calories: '',
          protein: '',
          carbs: '',
          fats: '',
          mealType: 'breakfast'
        })
        toast.success('Meal added successfully!')
      } else {
        console.error('Failed to add meal')
        toast.error('Failed to add meal.')
      }
    } catch (error) {
      console.error('Error submitting meal:', error)
      toast.error('Error submitting meal.')
    }
  }

  return (
    <div className="mx-auto md:mx-60">

      <h1 className="text-3xl font-bold text-primary mb-4">Nutrition Tracker</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Meal</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
            <input
              type="text"
              value={formData.foodItem}
              onChange={(e) => setFormData({ ...formData, foodItem: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Grilled Chicken"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="350"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
            <input
              type="number"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
            <input
              type="number"
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
            <input
              type="number"
              value={formData.fats}
              onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
            <select
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition duration-200"
            >
              Add Meal
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Meals</h2>
        {meals.length === 0 ? (
          <p className="text-gray-500">No meals added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-normal font-medium text-primary uppercase tracking-wider">Meal</th>
                  <th className="px-6 py-3 text-left text-normal font-medium text-primary uppercase tracking-wider">Calories</th>
                  <th className="px-6 py-3 text-left text-normal font-medium text-primary uppercase tracking-wider">Protein</th>
                  <th className="px-6 py-3 text-left text-normal font-medium text-primary uppercase tracking-wider">Carbs</th>
                  <th className="px-6 py-3 text-left text-normal font-medium text-primary uppercase tracking-wider">Fats</th>
                  <th className="px-6 py-3 text-left text-normal font-medium text-primary uppercase tracking-wider">Meal Type</th>
                  <th className="px-6 py-3 text-left text-normal font-medium text-primary uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {meals.map((meal) => (
                  <tr key={meal._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{meal.foodItem}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.calories}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.protein}g</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.carbs}g</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.fats}g</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meal.mealType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(meal.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
