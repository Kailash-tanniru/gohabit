"use client"

import React, { useState } from 'react';
import { FaGift, FaCalendarAlt, FaChevronDown, FaChevronUp} from 'react-icons/fa';
import { MdDelete, MdSpaceDashboard } from 'react-icons/md';
import Link from 'next/link';
import HabitActionComponent from './HabitActionComponent';
import { motion, AnimatePresence } from 'framer-motion';
import { format,isValid, parseISO, subDays } from 'date-fns';
export const dynamic = 'force-dynamic'; 

const HabitCard = ({ habit , darkMode, deleteHabit }) => {
  
  const [showDetails, setShowDetails] = useState(false);
  const calculateRemainingDays = () => {
    if (!habit || !habit.end_date) return 0;
    const endDate = new Date(habit.end_date);
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };
  if (!habit) {
    console.error('habit is undefined');
    return <div>No Habits</div>; // or handle the situation appropriately
  }
  const totaldays = () => {
    if (!habit || !habit.end_date || !habit.start_date) return 0;
    const endDate = new Date(habit.end_date);
    const start_Date = new Date(habit.start_date);
    const days = (endDate.getTime() - start_Date.getTime()) + 1;
    return Math.ceil(days / (1000 * 60 * 60 * 24));
  }

  const remainingDays = calculateRemainingDays();
  const days=  totaldays();
  console.log(habit);


  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  
  
  const streakUpdatedAt = habit.streak_updated_at || yesterday;
  

  const parsedDate = parseISO(streakUpdatedAt);
  

  const today = format(new Date(), 'yyyy-MM-dd');
  const streakUpdatedToday = isValid(parsedDate) && format(parsedDate, 'yyyy-MM-dd') === today;
  
  console.log(streakUpdatedToday);

  

  const getStreakBadge = (streak: number) => {
    if (streak >= 100) return '🏆 Grandmaster';
    if (streak >= 30) return '🔥 Streak Master';
    if (streak >= 7) return '💪 Habit Hero';
    return '🌱 Starter';
  };

  // Calculate completion percentage (for progress bar)
  
  const completionPercentage = Math.min((habit.current_streak / days) * 100, 100); 

  // Card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const toggleDetails = (e) => {
    if (e?.target?.closest('.delete-button')) return;
    setShowDetails((prev) => !prev);
  };

  return (
    <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover=""
    className={`relative rounded-xl shadow-md border overflow-hidden transition-all hover:shadow-lg 
      ${
        darkMode
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-700'
          : 'bg-gradient-to-r from-white to-gray-50 text-gray-900 border-gray-200'
      }
    `}
  >
    {/* Dynamic Progress Bar */}
    <div className="h-2 w-full bg-gray-200 relative">
      <motion.div
        className={`h-full ${
          habit.is_completed_today ? 'bg-green-500' : 'bg-gradient-to-r from-orange-400 to-red-400'
        }`}
        style={{ width: `${completionPercentage}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${completionPercentage}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>

    {/* Card Content */}
    <div className={`p-4 ${
        darkMode
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-700'
          : 'bg-gradient-to-r from-white to-gray-50 text-gray-900 border-gray-200'
      }`}>
      {/* Header Row */}
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={toggleDetails}
      >
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-4">
          {/* Circular Progress Bar */}
          <div className="relative w-14 h-14">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-200 stroke-current"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${
                  habit.is_completed_today ? 'text-green-500' : 'text-orange-500'
                } stroke-current`}
                strokeWidth="4"
                strokeDasharray={`${completionPercentage}, 100`}
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-full ${
                habit.is_completed_today ? 'bg-green-500' : 'bg-gradient-to-r from-orange-400 to-red-400'
              }`}
            >
              {habit.is_completed_today ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-white"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </motion.div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold break-all">{habit.name}</h3>
            <p
              className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              {habit.description}
            </p>
          </div>
        </div>

        {/* Right: Delete Button */}
        <button
          className="delete-button p-2 rounded-full transition-colors"
          onClick={() => deleteHabit(habit.id)}
          title="Delete habit"
        >
          <MdDelete className="text-xl text-red-500 hover:text-red-600" />
        </button>
      </div>

      {/* Streak & Quick Info */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm">
            🔥 Streak:{' '}
            <span className="font-semibold">{habit.current_streak | 0} Days</span>
          </p>
          <p className="text-sm">
            🏅 Badge:{' '}
            <span className="font-semibold">
              {getStreakBadge(habit.current_streak)}
            </span>
          </p>
          {remainingDays > 0 && (
            <p className="text-sm">
              ⏳ Days Left:{' '}
              <span className="font-mono">You&apos;re <span className='font-serif'>{remainingDays} </span>days away from
              a new milestone. Keep going! 💪</span>
            </p>
          )}
        </div>
        <button
          onClick={toggleDetails}
          className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors ${
            darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : ''
          }`}
        >
          {showDetails ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 text-sm border-t pt-4">
              {habit.start_date && (
                <p className="flex items-center gap-2">
                  <FaCalendarAlt
                    className={`${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  Started on: {habit.start_date}
                </p>
              )}

              <p className="flex items-center gap-2">
                ✅ Activity Status:{' '}
                <span
                  className={
                    habit.is_completed_today ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {habit.is_completed_today ? 'Done' : 'Not Done'}
                </span>
              </p>

              {habit.reward && (
                <div
                  className={`p-4 rounded-lg flex items-center gap-3 text-white 
                  ${
                    darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-700'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                >
                  <FaGift className="text-yellow-300 text-xl" />
                  <span className="font-medium">Reward: {habit.reward}</span>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                {(habit.is_completed_today) ? (
                  <span className="font-bold text-green-500">✔ Performed</span>
                ) : (
                  <HabitActionComponent habitId={habit.id} />
                )}
                <Link
                  href={`/habitdashboard/${habit.id}`}
                  className={`p-3 rounded-full shadow-md transition-colors 
                    ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }
                  `}
                >
                  <MdSpaceDashboard className="text-xl" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
  );
};

export default HabitCard;