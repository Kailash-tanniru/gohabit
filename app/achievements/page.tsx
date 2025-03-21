"use client";

import { useAuthStore } from '@/lib/stores/authStore';
import { useHabitStore } from '@/lib/stores/habitStore';
import React, { useEffect, useState } from 'react';
import {
  FaTrophy,
  FaGift,
  FaArrowRight,
  FaHome,

  FaCheckCircle,

} from 'react-icons/fa';
import Link from 'next/link';
import { motion} from 'framer-motion';

const Achievements = () => {
  const { habits, fetchHabits } = useHabitStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, refreshToken } = useAuthStore();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filtering and sorting state
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('name');

  // Fetch habits on mount
  useEffect(() => {
    const initHabits = async () => {
      try {
        setLoading(true);
        setError(null);

        await refreshToken();
        await fetchHabits();
      } catch (err) {
        console.error('Failed to fetch habits:', err);
        setError('Failed to load habits. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      initHabits();
    }
  }, [isAuthenticated, fetchHabits, refreshToken]);

  // Filter and sort achievements
  const achievedHabits = habits.filter((habit) => habit.is_achieved);
  const filteredAchievements = achievedHabits
    .filter((habit) => {
      if (filter === 'recent') {
        return (
          new Date(habit.end_date) >=
          new Date(new Date().setMonth(new Date().getMonth() - 1))
        );
      } else if (filter === 'oldest') {
        return (
          new Date(habit.end_date) <
          new Date(new Date().setMonth(new Date().getMonth() - 1))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sort === 'date') {
        return +new Date(b.end_date) - +new Date(a.end_date);
      } else if (sort === 'reward') {
        return (a.reward || '').localeCompare(b.reward || '');
      }
      return 0;
    });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAchievements = filteredAchievements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Share achievement
  // const shareAchievement = (habit: any) => {
  //   const shareText = `I just achieved my habit: ${habit.name}! 🎉`;
  //   const shareUrl = window.location.href;
  //   window.open(
  //     `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  //       shareText
  //     )}&url=${encodeURIComponent(shareUrl)}`,
  //     '_blank'
  //   );
  // };

  // Badges for milestones
  const badges = [
    { count: 10, label: 'Bronze Achiever', icon: FaCheckCircle, color: 'from-yellow-600 to-yellow-400' },
    { count: 50, label: 'Silver Achiever', icon: FaCheckCircle, color: 'from-gray-400 to-gray-200' },
    { count: 100, label: 'Gold Achiever', icon: FaCheckCircle, color: 'from-yellow-400 to-yellow-600' },
  ];

  // Render loading state
  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading Achievements...
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaTrophy className="text-yellow-500" />
            Your Achievements
          </h1>
          <Link
            href="/dashboard"
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <FaHome className="text-gray-700 dark:text-gray-200" />
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            You&apos;ve achieved {achievedHabits.length} out of {habits.length} habits
            so far.
          </p>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${
                  habits.length
                    ? (achievedHabits.length / habits.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Filter and Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <select
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            value={filter}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 ring-blue-500 transition-all"
          >
            <option value="all">All Achievements</option>
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
          </select>

          <select
            onChange={(e) => setSort(e.target.value)}
            value={sort}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 ring-blue-500 transition-all"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="reward">Sort by Reward</option>
          </select>
        </div>

        {/* Achievements Grid */}
        {currentAchievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAchievements.map((habit) => (
              <motion.div
                key={habit.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {habit.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {habit.description}
                  </p>
                </div>

                {habit.reward && (
                  <div className="mt-4 p-3 rounded-lg flex items-center gap-2 bg-gray-50 dark:bg-gray-700">
                    <FaGift className="text-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {habit.reward}
                    </span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/habitdashboard/${habit.id}`}
                    className="text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View Details
                    <FaArrowRight />
                  </Link>
                  {/* <button
                    onClick={() => shareAchievement(habit)}
                    className="text-green-500 dark:text-green-400 hover:underline flex items-center gap-1"
                  >
                    Share
                    <FaShare />
                  </button> */}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700 dark:text-gray-300">
              No achievements yet. Keep going!
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Consistency is key. You’ll get there soon!
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          {Array.from(
            {
              length: Math.ceil(filteredAchievements.length / itemsPerPage),
            },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 ring-blue-500 ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>

        {/* Badges */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            {badges.map((badge) => {
              const hasBadge = achievedHabits.length >= badge.count;
              const Icon = badge.icon;
              return (
                <div
                  key={badge.count}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                    hasBadge
                      ? `bg-gradient-to-r ${badge.color} text-white shadow`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Icon className="text-lg" />
                  {badge.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;