import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-secondary">

      {/* Hero */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&auto=format&fit=crop&q=60"
          alt="chef cooking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            About Us
          </span>
          <h1 className="font-display text-5xl text-white leading-tight mb-4">
            We're building the home <br />for <span className="text-orange-300">culinary creators</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl leading-relaxed">
            RecipeNest was built with one simple idea — every chef deserves a beautiful, 
            dedicated space to share their passion for food with the world.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-4xl text-dark mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We believe that food is more than just sustenance — it's culture, art, and connection. 
              RecipeNest was created to give professional chefs and home cooks alike a platform to 
              showcase their culinary expertise and connect with food lovers around the world.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Whether you're a Michelin-starred chef or someone who loves cooking for family, 
              RecipeNest gives you the tools to build your culinary brand, share your recipes, 
              and grow your audience.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <h3 className="font-bold text-3xl text-primary">50+</h3>
                <p className="text-gray-400 text-sm mt-1">Expert Chefs</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <h3 className="font-bold text-3xl text-primary">200+</h3>
                <p className="text-gray-400 text-sm mt-1">Recipes Shared</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <h3 className="font-bold text-3xl text-primary">1k+</h3>
                <p className="text-gray-400 text-sm mt-1">Food Lovers</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
                <h3 className="font-bold text-3xl text-primary">20+</h3>
                <p className="text-gray-400 text-sm mt-1">Countries</p>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden h-48">
              <img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&auto=format&fit=crop&q=60"
                   alt="chef" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
            </div>
            <div className="rounded-2xl overflow-hidden h-48 mt-6">
              <img src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=400&auto=format&fit=crop&q=60"
                   alt="chef" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
            </div>
            <div className="rounded-2xl overflow-hidden h-48">
              <img src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop&q=60"
                   alt="chef" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
            </div>
            <div className="rounded-2xl overflow-hidden h-48 mt-6">
              <img src="https://images.unsplash.com/photo-1605522469906-3fe226b356bc?w=400&auto=format&fit=crop&q=60"
                   alt="chef" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-4xl text-dark text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-secondary rounded-3xl">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍳</span>
              </div>
              <h3 className="font-display text-xl text-dark mb-2">Culinary Excellence</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We celebrate chefs who push the boundaries of culinary art and inspire others with their craft.
              </p>
            </div>
            <div className="text-center p-6 bg-secondary rounded-3xl">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-display text-xl text-dark mb-2">Community First</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Food brings people together. We build tools that help chefs connect with food lovers worldwide.
              </p>
            </div>
            <div className="text-center p-6 bg-secondary rounded-3xl">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-display text-xl text-dark mb-2">Simple & Beautiful</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We believe great design makes sharing food more enjoyable for chefs and food lovers alike.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-4xl text-dark mb-4">
          Ready to share your <span className="text-primary">recipes?</span>
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Join thousands of chefs already on RecipeNest.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register"
            className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition">
            Join as Chef
          </Link>
          <Link to="/chefs"
            className="border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition">
            Browse Chefs
          </Link>
        </div>
      </div>

    </div>
  );
};

export default About;