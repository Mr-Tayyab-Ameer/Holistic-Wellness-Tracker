import React from 'react';
import { Dumbbell, Utensils, Smile, HeartPulse, BarChart3, Users } from 'lucide-react';
import logo from '../assets/logo.svg';

const testimonials = [
  {
    name: 'Sarah M.',
    quote: 'This app helped me finally balance my fitness and nutrition. The stress tracking is a game changer!',
    role: 'University Student',
  },
  {
    name: 'John D.',
    quote: 'I love the personalized recommendations. My health has never been better!',
    role: 'Software Engineer',
  },
  {
    name: 'Ayesha K.',
    quote: 'The dashboard is so easy to use and the insights are spot on. Highly recommended!',
    role: 'Fitness Enthusiast',
  },
];

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-blue-100 py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
          <img src={logo} alt="Holistic Wellness Tracker Logo" className="w-24 h-24 mb-6 drop-shadow-xl" />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-primary drop-shadow">Holistic Wellness Tracker</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Your all-in-one platform to track fitness, nutrition, and stress. Achieve your best self with science-backed insights and a beautiful, easy-to-use dashboard.
          </p>
          <a href="/register" className="btn-primary text-lg px-8 py-3 rounded-full font-semibold shadow-lg">Get Started</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card flex flex-col items-center">
              <Dumbbell size={48} className="text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fitness Tracking</h3>
              <p className="text-gray-600 text-center">Monitor workouts, set goals, and visualize your progress with interactive charts.</p>
            </div>
            <div className="card flex flex-col items-center">
              <Utensils size={48} className="text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized Nutrition</h3>
              <p className="text-gray-600 text-center">Get diet plans and calorie targets tailored to your BMI, goals, and preferences.</p>
            </div>
            <div className="card flex flex-col items-center">
              <Smile size={48} className="text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Stress Management</h3>
              <p className="text-gray-600 text-center">Track your mood, get calming tips, and build healthy habits for mind and body.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users size={40} className="mb-3 text-primary" />
              <span className="font-semibold mb-1">1. Sign Up</span>
              <span className="text-gray-600">Create your free account in seconds.</span>
            </div>
            <div className="flex flex-col items-center">
              <HeartPulse size={40} className="mb-3 text-red-500" />
              <span className="font-semibold mb-1">2. Track</span>
              <span className="text-gray-600">Log your fitness, nutrition, and stress data easily.</span>
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 size={40} className="mb-3 text-blue-600" />
              <span className="font-semibold mb-1">3. Get Insights</span>
              <span className="text-gray-600">See trends, get recommendations, and stay motivated.</span>
            </div>
            <div className="flex flex-col items-center">
              <Smile size={40} className="mb-3 text-green-600" />
              <span className="font-semibold mb-1">4. Achieve Goals</span>
              <span className="text-gray-600">Celebrate your progress and feel your best!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">What Makes Us Different?</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex items-start gap-4">
              <span className="text-3xl text-primary">✔️</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Science-Backed & Personalized</h4>
                <p className="text-gray-600">All recommendations are based on the latest health research and tailored to your unique profile.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl text-primary">🔒</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Privacy First</h4>
                <p className="text-gray-600">Your data is secure and never shared. You control your wellness journey.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl text-primary">📊</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">All-in-One Dashboard</h4>
                <p className="text-gray-600">No more juggling apps. Track everything in one beautiful, unified platform.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl text-primary">💡</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Easy to Use</h4>
                <p className="text-gray-600">Intuitive design, clear visuals, and helpful tips make wellness simple for everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
                <span className="text-4xl mb-3">“</span>
                <p className="text-gray-700 italic mb-4 text-center">{t.quote}</p>
                <span className="font-semibold text-primary">{t.name}</span>
                <span className="text-xs text-gray-500">{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Project Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">About This Project</h2>
          <p className="text-gray-700 mb-4">
            Holistic Wellness Tracker is a capstone project designed to demonstrate best practices in modern web development, user experience, and evidence-based health technology. Built with React, Node.js, and MongoDB, it integrates fitness, nutrition, and stress management into a single, user-friendly platform.
          </p>
          <p className="text-gray-600">
            Our mission: Empower everyone to take control of their well-being with science, simplicity, and privacy at the core.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 mt-10 text-center">
        <div className="flex flex-col items-center gap-2">
          <img src={logo} alt="Holistic Wellness Tracker Logo" className="w-10 h-10 mb-2" />
          <p className="font-semibold">&copy; {new Date().getFullYear()} Holistic Wellness Tracker. All rights reserved.</p>
          <p className="text-xs">Made with ❤️ for health, happiness, and learning.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
