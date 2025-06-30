import React from 'react';
import { Dumbbell, Utensils, Smile } from 'lucide-react'; // Updated icons

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-100 to-blue-100 py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-primary">
            Welcome to Holistic Wellness Tracker
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700">
            Track your fitness, plan your nutrition, and manage stress — all in one place.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">What is Holistic Wellness?</h2>
          <p className="text-lg text-gray-600">
            Holistic wellness means balancing your body, mind, and lifestyle. Our platform empowers you
            to manage every part of your well-being in one simple dashboard.
          </p>
        </div>
      </section>

      {/* Modules Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Fitness */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="text-blue-600 flex justify-center mb-6">
                <Dumbbell size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Fitness Tracker</h3>
              <p className="text-gray-600 text-center">
                Monitor workouts, track calories, and view progress with ease.
              </p>
            </div>

            {/* Nutrition */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="text-green-600 flex justify-center mb-6">
                <Utensils size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Nutrition Plan</h3>
              <p className="text-gray-600 text-center">
                Get personalized diet plans based on your BMI and preferences.
              </p>
            </div>

            {/* Stress */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="text-orange-500 flex justify-center mb-6">
                <Smile size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Stress Recommendation</h3>
              <p className="text-gray-600 text-center">
                Receive calming tips based on real-time emotional analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-100 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Your Wellness Journey Today</h2>
        <p className="text-lg text-gray-700 mb-8">
          Sign-up needed. Just explore and discover a healthier you.
        </p>
        <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primaryhover transition">
         <a href='/register'>Sign Up</a>
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 py-6 mt-10 text-center text-gray-700">
        <p>&copy; {new Date().getFullYear()} Holistic Wellness Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
