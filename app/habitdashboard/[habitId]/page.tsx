"use client";

import React, { useState, useEffect, use } from "react";
import "react-calendar/dist/Calendar.css";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaTrophy,
  FaFire,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Calendar from "react-calendar";
import { useHabitStore } from "@/lib/stores/habitStore";
import { useRouter } from "next/navigation";
import HabitActionComponent from "@/app/dashboard/components/HabitTracker/HabitCard/HabitActionComponent";



interface HabitLog {
  id: number;
  habitId: number;
  date: string;
  mood: string;
  notes: string;
  completed: boolean;
}

const HabitDashboard = ({ params }: { params: { habitId: string } }) => {
   const { habitId } = use(params);
  const { habits, habitLogs, fetchHabitLogs, fetchHabits } = useHabitStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const formattedDate = selectedDate.toISOString().split("T")[0];

  useEffect(() => {
    if (habitId) {
      try {
        fetchHabitLogs(parseInt(habitId), formattedDate);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setLog(null);
      }
    }
  }, [habitId, fetchHabitLogs, formattedDate]);

  // Find the log for the selected date
  const log = Array.isArray(habitLogs)
    ? habitLogs.find((log: HabitLog) => log.date === formattedDate)
    : null;

  // Find the current habit based on the habitId
  const habit = habits.find((h) => h.id === Number(habitId));

  if (!habit) {
    return <div>Loading...</div>;
  }

  // Function to check if a date is within the habit's start and end date
  const isDateInRange = (date: Date) => {
    const startDate = new Date(habit.start_date);
    const endDate = habit.end_date ? new Date(habit.end_date) : null;
    return (
      date >= startDate &&
      (!endDate || date <= endDate)
    );
  };

  return (
    <main className="h-screen flex flex-col font-sans bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-[#FDFAF6] border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Back button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            <FaArrowLeft size={20} className="text-gray-700" />
          </button>

          {/* Title Section */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {habit.name}
            </h2>
            <p className="text-sm text-gray-600">{habit.description}</p>
          </div>

          {/* Calendar Toggle */}
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            <FaCalendarAlt size={20} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow max-w-7xl  mx-auto w-full px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Panel: Log Details */}
        <section className="md:w-2/3 flex flex-col gap-6">
          {/* Log Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Daily Log – {formattedDate}
            </h3>
            <div className="flex flex-col gap-4">
              {/* Mood & Completion */}
              <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Mood:</span>
                  <span className="text-gray-600">
                    {log?.mood || "Not logged"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Status:</span>
                  {log?.completed ? (
                    <span className="text-green-600">Completed</span>
                  ) : log ? (
                    <span className="text-red-600">Not Completed</span>
                  ) : (
                    <span className="text-gray-400">No data</span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <h4 className="text-md font-semibold mb-2 text-gray-700">
                  Notes
                </h4>
                <p className="text-gray-600">
                  {log?.notes || "No notes available."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Habit Stats */}
        <aside className="md:w-1/3 flex flex-col gap-6">
          {/* Habit Info Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Habit Overview
            </h4>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                <p>
                  <span className="font-semibold">Reward:</span>{" "}
                  {habit.reward || "No reward set"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
                <p>
                  <span className="font-semibold">Start Date:</span>{" "}
                  {habit.start_date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
                <p>
                  <span className="font-semibold">End Date:</span>{" "}
                  {habit.end_date || "No end date"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaFire className="text-red-500" />
                <p>
                  <span className="font-semibold">Days Left:</span>{" "}
                  {habit.end_date
                    ? Math.ceil(
                        (new Date(habit.end_date).getTime() -
                          new Date().getTime()) /
                          (1000 * 3600 * 24)
                      )
                    : "N/A"}{" "}
                  days
                </p>
              </div>
            </div>
          </div>

          {/* Mark Habit Status Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Mark Habit Status
            </h3>
            <div className="flex justify-between items-center mt-4">
              {habit.is_completed_today ? (
                <span className="font-bold text-green-500">✔ Performed</span>
              ) : (
                <HabitActionComponent habitId={habit.id} />
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Progress & Stats
            </h4>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-2">
                <FaFire className="text-red-500" />
                <p>
                  <span className="font-semibold">Current Streak:</span>{" "}
                  {habit.current_streak} days
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaFire className="text-red-500" />
                <p>
                  <span className="font-semibold">Max Streak:</span>{" "}
                  {habit.max_streak} days
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <p>
                  <span className="font-semibold">Completion Rate:</span>{" "}
                  {/* Example placeholder */}
                  10%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaTimesCircle className="text-red-500" />
                <p>
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {habit.streak_updated_at}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-sm w-full">
            {/* Close Button */}
            <button
              onClick={() => setIsCalendarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Calendar Component */}
            <Calendar
              onChange={(date: Date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
              value={selectedDate}
              className="rounded-lg border border-gray-200"
              tileDisabled={({ date }) => !isDateInRange(date)} // Disable dates outside the range
              tileClassName={({ date }) =>
                date.toDateString() === selectedDate.toDateString()
                  ? "bg-blue-500 text-white rounded-full"
                  : isDateInRange(date)
                  ? "hover:bg-gray-100"
                  : "text-gray-400 cursor-not-allowed"
              }
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default HabitDashboard;


