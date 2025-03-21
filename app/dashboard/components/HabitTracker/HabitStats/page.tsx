import React from 'react';
import { FaFire, FaCheckCircle,FaTrophy } from 'react-icons/fa';
import { GiStairsGoal } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { FaScaleUnbalancedFlip } from "react-icons/fa6";

const StatsCards = ({ stats, darkMode }) => {
  const cardBaseStyles = `
    relative 
    overflow-hidden 
    p-4 
    rounded-xl 
    shadow-md 
    hover:shadow-lg 
    transition-shadow 
    cursor-pointer
  `;

  // Define gradient colors for each stat (light & dark mode)
  const gradients = {
    totalHabits: {
      light: 'from-blue-500 to-blue-400',
      dark: 'from-blue-600 to-blue-500',
    },
    completedToday: {
      light: 'from-green-500 to-green-400',
      dark: 'from-green-600 to-green-500',
    },
    averageStreak: {
      light: 'from-purple-500 to-purple-400',
      dark: 'from-purple-600 to-purple-500',
    },
    longestStreak: {
      light: 'from-yellow-500 to-yellow-400',
      dark: 'from-yellow-600 to-yellow-500',
    },
    goalsAchieved: {
      light: 'from-red-500 to-red-400',
      dark: 'from-red-600 to-red-500',
    },
  };

  // Determine text and background colors based on dark mode
  const containerBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
  const labelColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  // Reusable card element
  const StatCard = ({ label, value, icon, gradientKey, suffix }) => {
    // Choose the correct gradient for light/dark mode
    const gradientClass = darkMode
      ? gradients[gradientKey].dark
      : gradients[gradientKey].light;

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${cardBaseStyles} ${containerBg} ${textColor} border ${borderColor}`}
      >
        {/* Gradient strip on the left */}
        <div
          className={`absolute top-0 left-0 h-full w-1 sm:w-1.5 bg-gradient-to-b ${gradientClass} rounded-l-xl`}
        />

        {/* Card content */}
        <div className="flex items-center space-x-4">
          {/* Icon in a circular gradient background */}
          <div
            className={`flex-shrink-0 p-3 rounded-full bg-gradient-to-tr ${gradientClass} text-white`}
          >
            {icon}
          </div>

          {/* Textual stats */}
          <div>
            <p className={`text-xs sm:text-sm font-medium ${labelColor}`}>{label}</p>
            <p className="text-xl sm:text-xl font-bold">
              {value}
              {suffix ? ` ${suffix}` : ''}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  // Staggered animation for the grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <StatCard
          label="Total Habits"
          value={stats.totalHabits}
          icon={<FaFire className="text-lg sm:text-xl" />}
          gradientKey="totalHabits"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatCard
          label="Today Performed"
          value={stats.completedToday}
          icon={<FaCheckCircle className="text-lg sm:text-xl" />}
          gradientKey="completedToday"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatCard
          label="Due Today"
          value={stats.dueToday}
          icon={<FaScaleUnbalancedFlip className="text-lg sm:text-xl" />}
          gradientKey="goalsAchieved" suffix={undefined}        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatCard
          label="Longest Streak"
          value={stats.longestStreak || 0}

          icon={<FaTrophy className="text-lg sm:text-xl" />}
          gradientKey="longestStreak" suffix={undefined}        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatCard
          label="Goals Achieved"
          value={stats.goalsAchieved}
          icon={<GiStairsGoal className="text-lg sm:text-xl" />}
          gradientKey="goalsAchieved" suffix={undefined}        />
      </motion.div>
    </motion.div>
  );
};

export default StatsCards;