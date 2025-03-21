import React, { useMemo } from 'react';
import { FaFire, FaCheckCircle, FaChartLine, FaTrophy } from 'react-icons/fa';
import { FaScaleUnbalancedFlip } from "react-icons/fa6";
const StatsCards = ({ darkMode, habits }) => {
  const stats = useMemo(() => {
    const totalHabits = habits?.length || 0; // Use optional chaining and fallback
    const completedToday =
      habits?.filter((habit) => habit?.is_completed_today).length || 0;
    const totalStreak =
      habits?.reduce((sum, habit) => sum + (habit?.current_streak || 0), 0) || 0;
    const averageStreak =
      totalHabits > 0 ? (totalStreak / totalHabits).toFixed(1) : 0;
    const longestStreak =
      habits?.reduce((max, habit) => Math.max(max, habit?.max_streak || 0), 0) || 0;
    const dueToday = habits?.filter((habit) => !habit?.is_completed_today).length || 0;
    const goalsAchieved =
      habits?.filter((habit) => habit?.is_achieved).length || 0;
    const progress = totalHabits > 0 ? (goalsAchieved / totalHabits) * 100 : 0;

    return {
      totalHabits,
      completedToday,
      averageStreak,
      longestStreak,
      goalsAchieved,
      progress,
      dueToday,
    };
  }, [habits]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-2">
      {/* Total Habits Card */}
      <div className="p-4 rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <FaFire className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Habits</p>
            <p className="text-xl font-bold text-gray-800">
              {stats.totalHabits ?? 0} {/* Fallback to 0 if undefined */}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <FaScaleUnbalancedFlip className="text-red-800 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Due Today</p>
            <p className="text-xl font-bold text-gray-800">
              {stats.dueToday ?? 0} {/* Fallback to 0 if undefined */}
            </p>
          </div>
        </div>
      </div>

      {/* Completed Today Card */}
      <div className="p-4 rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed Today</p>
            <p className="text-xl font-bold text-gray-800">
              {stats.completedToday ?? 0} {/* Fallback to 0 if undefined */}
            </p>
          </div>
        </div>
      </div>

      {/* Average Streak Card */}
      <div className="p-4 rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <FaChartLine className="text-purple-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Streak</p>
            <p className="text-xl font-bold text-gray-800">
              {stats.averageStreak ?? 0}  {/* Fallback to 0 if undefined */}
            </p>
          </div>
        </div>
      </div>

      {/* Longest Streak Card */}
      <div className="p-4 rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 rounded-lg">
            <FaTrophy className="text-yellow-500 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Longest Streak</p>
            <p className="text-xl font-bold text-gray-800">
              {stats.longestStreak ?? 0} {/* Fallback to 0 if undefined */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;