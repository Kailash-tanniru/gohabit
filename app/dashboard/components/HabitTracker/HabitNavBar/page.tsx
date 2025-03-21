"use client"
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaSearch, FaPlus, FaMoon, FaSun } from 'react-icons/fa';
import HabitCreateForm from '../HabitCreateForm/page';

const HabitNavBar = ({ searchQuery, handleSearchChange, darkMode, toggleDarkMode }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);  
  const handleCreateClick = () => {
    setIsFormOpen(true); // Open the form
  };
  const handleCloseForm = () => {
    setIsFormOpen(false); // Close the form
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-around p-4 rounded-lg 
        ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-r bg-white text-gray-900'}`}
    >
      {/* Left Section: Title */}
      <div className="flex items-center space-x-4">
        <h1 className="text-sm md:text-2xl font-bold ">GoHabit</h1>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="flex-1 mx-8 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-full outline-none transition-all 
              ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400'}`}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-4">
        {/* Create Habit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateClick}
          className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold rounded-full transition-all 
            ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'}`}
        >
          <FaPlus />
          
                
        </motion.button>

        {isFormOpen && <HabitCreateForm onClose={handleCloseForm} />}

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-full transition-all flex items-center justify-center 
            ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md'}`}
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HabitNavBar;