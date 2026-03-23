import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import About from './pages/About';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ChefsList from './pages/ChefsList';
import ChefProfile from './pages/ChefProfile';
import RecipePortfolio from './pages/RecipePortfolio';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import AddEditRecipe from './pages/AddEditRecipe';
import Recipes from './pages/Recipes';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chefs" element={<ChefsList />} />
          <Route path="/chefs/:id" element={<ChefProfile />} />
          <Route path="/chefs/:id/recipes" element={<RecipePortfolio />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/about" element={<About />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/add-recipe" element={
            <ProtectedRoute>
              <AddEditRecipe />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/edit-recipe/:id" element={
            <ProtectedRoute>
              <AddEditRecipe />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;