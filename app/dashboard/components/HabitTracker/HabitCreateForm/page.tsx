"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaBell, FaStar, FaGift } from 'react-icons/fa';
import { BsCalendar } from 'react-icons/bs';
import { useHabitStore } from '@/lib/stores/habitStore';
import { useAuthStore } from '@/lib/stores/authStore';

const HabitCreateForm = ({ onClose }) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const [error, setError] = useState<string | null>(null); 

  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    start_date: today, // Fixed to today's date
    end_date: '',
    reminder_toggle: false,
    reminder_type: 'email', // Default
    frequency: 'daily',     // Default
    reward: '',
    is_important: true,     // Default
  });

  const { createHabit } = useHabitStore();
  const { refreshToken } = useAuthStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewHabit((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await refreshToken();
      await createHabit(newHabit);
      onClose(); // Close the modal after successful submission
    } catch (error) {
      if (error.response?.data?.name) {
        setError(error.response.data.name); // Set error message
      } else {
        console.error('Failed to create habit:', error.response?.data);
        setError('Failed to create habit. Please try again.'); // Generic error
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <motion.div
        className="relative w-full max-w-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Form Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create a New Habit
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Build a habit that lasts with consistency and rewards.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Name & Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Habit Name
            </label>
            <input
              type="text"
              name="name"
              value={newHabit.name}
              onChange={handleChange}
              placeholder="e.g., Drink Water"
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400"
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p> // Display error message
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={newHabit.description}
              onChange={handleChange}
              placeholder="e.g., Drink at least 8 glasses of water daily."
              rows={3}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Date Range Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label
                htmlFor="start_date"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <BsCalendar className="text-gray-500 dark:text-gray-400" />
                  Start Date
                </span>
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={newHabit.start_date}
                onChange={handleChange}
                required
                disabled // Disable editing of start_date
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-not-allowed"
              />
            </div>
            {/* End Date */}
            <div>
              <label
                htmlFor="end_date"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <BsCalendar className="text-gray-500 dark:text-gray-400" />
                  End Date
                </span>
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={newHabit.end_date}
                onChange={handleChange}
                min={newHabit.start_date} // Hide dates before start_date
                required
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Reward & Frequency Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reward */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Reward
              </label>
              <div className="relative">
                <FaGift className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  name="reward"
                  value={newHabit.reward}
                  onChange={handleChange}
                  placeholder="e.g., Watch a movie"
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-10 pr-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400"
                />
              </div>
            </div>
            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Frequency
              </label>
              <select
                name="frequency"
                value={newHabit.frequency}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Toggles Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <FaStar className="mr-2 text-yellow-500" />
              <input
                type="checkbox"
                name="is_important"
                checked={newHabit.is_important}
                onChange={handleChange}
                className="rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Important
              </span>
            </div>
            <div className="flex items-center">
              <FaBell className="mr-2 text-blue-500" />
              <input
                type="checkbox"
                name="reminder_toggle"
                checked={newHabit.reminder_toggle}
                onChange={handleChange}
                className="rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Reminder
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 py-3 px-6 text-white font-semibold hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Create Habit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default HabitCreateForm;