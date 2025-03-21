"use client"
import React, { useEffect, useState, useMemo } from 'react';
import {

  FaPlus,
  FaSadTear,
  FaTasks,
  FaInfoCircle,
  FaFire,
  FaTrophy,
} from 'react-icons/fa';
import HabitCard from './HabitCard/page';
import HabitNavBar from './HabitNavBar/page';
import StatsCards from './HabitStats/page';
import { useHabitStore } from '@/lib/stores/habitStore';
import { useAuthStore } from '@/lib/stores/authStore';

import Link from 'next/link';
import HabitCreateForm from './HabitCreateForm/page';


// Simple pagination hook
// const usePagination = (data, itemsPerPage) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = Math.ceil(data.length / itemsPerPage);

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentData = data.slice(startIndex, endIndex);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   return { currentData, currentPage, totalPages, nextPage, prevPage, setCurrentPage };
// };

const HabitTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  // const [error, setError] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false); // For mobile Habits Info panel

  const { habits, fetchHabits, deleteHabit } = useHabitStore();
  const { isAuthenticated, refreshToken } = useAuthStore();
    const [isFormOpen, setIsFormOpen] = useState(false);  
    const handleCreateClick = () => {
      setIsFormOpen(true); // Open the form
    };
    const handleCloseForm = () => {
      setIsFormOpen(false); // Close the form
    };

  // Filter unachieved habits
  // const unachievedHabits = useMemo(() => {
  //   return habits.filter((habit) => !habit.is_achieved);
  // }, [habits]);

  // Fetch habits on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        if (isAuthenticated) {
          await refreshToken();
          await fetchHabits();
        }
      } catch (err) {
        console.error('Failed to fetch habits:', err);
      }
    };

    initialize();
  }, [isAuthenticated, fetchHabits, refreshToken]);

  // Filter habits by search
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) =>
      habit.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [habits, searchQuery]);

  // Pagination
  // const {
  //   currentData: currentHabits,
  //   currentPage,
  //   totalPages,
  //   nextPage,
  //   prevPage,
  // } = usePagination(filteredHabits, 3);
  const dueTodayHabits = habits.filter((habit) => !habit.is_completed_today);
  // Calculate stats
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const completedToday = habits.filter((habit) => habit.is_completed_today).length;
    const totalStreak = habits.reduce((sum, habit) => sum + habit.current_streak, 0);
    const averageStreak = totalHabits > 0 ? (totalStreak / totalHabits).toFixed(1) : '0';
    const longestStreak = habits.reduce(
      (max, habit) => Math.max(max, habit.max_streak),
      0
    );
    const dueToday = dueTodayHabits.length;
    const goalsAchieved = habits.filter((habit) => habit.is_achieved).length || 0;
    const progress = totalHabits>0 ? (goalsAchieved/totalHabits)*100:0;

    return { totalHabits, completedToday, averageStreak, longestStreak, goalsAchieved,progress,dueToday };
  }, [dueTodayHabits.length, habits]);

  // Identify habits due today (example condition)
  

  // Loading state
  if (!isAuthenticated) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading Habits...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
      } h-screen overflow-hidden flex  flex-col`}
    >
      {/* Navbar (fixed at the top, no scrolling) */}
      <div className="flex-shrink-0">
        <HabitNavBar
          searchQuery={searchQuery}
          handleSearchChange={(e) => setSearchQuery(e.target.value)}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode((prev) => !prev)}
        />
      </div>

      {/* Stats Section (also fixed height, no scrolling) */}
      <div className="hidden md:block flex-shrink-0 p-2 "> 
        <StatsCards stats={stats} darkMode={darkMode} />
      </div>
      {isFormOpen && <HabitCreateForm onClose={handleCloseForm} />}

      {/* Main Content: takes remaining space */}
      <div className="flex-1 flex overflow-hidden ">
        {/* Left Panel: Habits List (scrollable) */}
        <div className="w-full lg:w-3/4 overflow-y-auto  p-4 relative ">
          {/* Error State */}
          {/* {error && <p className="mt-2 text-red-500">{error}</p>} */}

          {/* Quick Actions (e.g., add new habit, filter, etc.) */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold ">
              <FaTasks className="inline-block mr-2" />
              Habits
            </h3>
            <button
              onClick={handleCreateClick}

              className="flex items-center cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />Create Habit
            </button>
          </div>
          

          {filteredHabits.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 ">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  darkMode={darkMode}
                  deleteHabit={() => deleteHabit(habit.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <FaSadTear
                className={`text-4xl ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <p
                className={`mt-2 text-lg font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                No habits found
              </p>
            </div>
          )}

          {/* Pagination (simple example) */}
          {/* 
            Fixed at the bottom-center:
            - "fixed" positions it relative to the viewport 
            - "left-1/2" + "transform -translate-x-1/2" centers horizontally
          */}
          
        </div>

        {/* Right Panel: Static Info (no scrolling) */}
        <div className="hidden lg:w-1/4 lg:block pr-4 ml-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Habits Info
      </h2>

      {/* "Due Today" Section */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <FaFire className="text-red-500" />
          Due Today
        </h3>
        {dueTodayHabits.length > 0 ? (
          <ul className="space-y-3">
            {dueTodayHabits.map((habit) => (
              <li key={habit.id} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {habit.name}
                </span>
                <Link href={`/habitdashboard/${habit.id}`}>
                  <button className="text-blue-500 hover:text-blue-600 font-semibold text-sm hover:underline transition-colors duration-200">
                    DashBoard
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-400 italic">
            No habits are due today. Well done!
          </p>
        )}
      </div>

      {/* Additional Info / Stats */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <FaTrophy className="text-yellow-500" />
          Achievements & Goals
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Keep track of your overall progress and streaks!
        </p>

        {/* Example progress bar */}
        <div className="bg-gray-100 dark:bg-gray-600 rounded-full h-2 w-full mb-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.progress}%` }} // Example progress
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-400 mb-4">
          {Math.round(stats.progress)}% of habits completed
        </p>

        {/* Quick Stats */}
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li className="flex items-center justify-between">
            <span className="font-medium">Current Longest Streak:</span>
            <span className="text-gray-800 dark:text-gray-100">{stats.longestStreak | 0} </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="font-medium">Actions performed today:</span>
            <span className="text-gray-800 dark:text-gray-100">{stats.completedToday}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="font-medium">Goals Achieved:</span>
            <span className="text-gray-800 dark:text-gray-100">{stats.goalsAchieved}</span>
          </li>
        </ul>
      </div>
      
    </div>

        {/* Mobile Habits Info Toggle Button */}
        <button
          onClick={() => setIsInfoOpen(!isInfoOpen)}
          className="fixed bottom-4 right-4 md:hidden p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <FaInfoCircle className="text-2xl" />
        </button>

        {/* Mobile Habits Info Panel (Drawer) */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isInfoOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden z-50`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Habits Info
            </h2>

            {/* "Due Today" Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-5 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <FaFire className="text-red-500" />
                Due Today
              </h3>
              {dueTodayHabits.length > 0 ? (
                <ul className="space-y-3">
                  {dueTodayHabits.map((habit) => (
                    <li key={habit.id} className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {habit.name}
                      </span>
                      <Link href={`/habitdashboard/${habit.id}`}>
                        <button className="text-blue-500 hover:text-blue-600 font-semibold text-sm hover:underline transition-colors duration-200">
                          Go to Dashboard
                        </button>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-400 italic">
                  No habits are due today. Well done!
                </p>
              )}
            </div>

            {/* Additional Info / Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-5">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                Achievements & Goals
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Keep track of your overall progress and streaks!
              </p>

              {/* Example progress bar */}
              <div className="bg-gray-100 dark:bg-gray-600 rounded-full h-2 w-full mb-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                  style={{ width: '60%' }} // Example progress
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-400 mb-4">
                60% of habits completed this week
              </p>

              {/* Quick Stats */}
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>
                  <span className="font-medium">Current Longest Streak:</span> {stats.longestStreak} days
                </li>
                <li>
                  <span className="font-medium">Habits Completed Today:</span> {stats.completedToday}
                </li>
                <li>
                  <span className="font-medium">Goals Achieved:</span> {stats.goalsAchieved}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
