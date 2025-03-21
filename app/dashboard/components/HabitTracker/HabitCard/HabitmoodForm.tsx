import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const HabitmoodForm = ({ handleMoodSelection, setJournalEntry, handleSubmit, mood, journalEntry, onClose,status }) => {
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state
   // Track success or failure
  const [motivationalQuote, setMotivationalQuote] = useState(''); // Store motivational quote

  // Array of motivational quotes
  const motivationalQuotes = [
    "Success is the sum of small efforts, repeated day in and day out.",
    "You are capable of amazing things.",
    "Every small step counts. Keep going!",
    "Believe you can and you're halfway there.",
    "Progress, not perfection.",
    "You're stronger than you think.",
    "One day at a time. You've got this!",
  ];

  // Handle form submission
  const handleFormSubmit = () => {
    // Simulate success or failure (replace this with your logic)


    // Randomly select a motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setMotivationalQuote(randomQuote);

    // Call the original submit handler
    handleSubmit();

    // Show feedback message
    setIsSubmitted(true);
  };

  return (
    <div>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-11/12 max-w-md sm:max-w-lg p-4 sm:p-6 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Conditional Rendering: Form or Feedback Message */}
          {!isSubmitted ? (
            <>
              {/* Modal Header */}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  How are you feeling today?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select your mood and share your thoughts.
                </p>
              </div>

              {/* Mood Selection Dropdown */}
              <div className="mb-4 sm:mb-6">
                <select
                     className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white transition-all text-sm sm:text-base"
                     value={mood}
                     onChange={(e) => handleMoodSelection(e.target.value)}
                      aria-label="Select Mood"
                      >
                     <option value="" disabled>Select your mood</option>
                               <option value="Happy">
                                  😊 Happy
                               </option>
                              <option value="Tired">
                                 😴 Tired
                               </option>
                              <option value="Excited">
                              🤩 Excited
                              </option>
                 </select>
              </div>

              {/* Journal Entry */}
              <textarea
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white transition-all resize-none text-sm sm:text-base"
                rows="6"
                placeholder="Write about your experience..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                aria-label="Journal Entry"
              />

              {/* Submit Button */}
              <motion.button
                className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFormSubmit}
                aria-label="Submit"
              >
                Submit
              </motion.button>
            </>
          ) : (
            /* Feedback Message */
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Success or Failure Icon */}
              {status ? (
                <FaCheckCircle className="w-12 h-12 mx-auto text-green-500 dark:text-green-400 mb-4" />
              ) : (
                <FaTimesCircle className="w-12 h-12 mx-auto text-red-500 dark:text-red-400 mb-4" />
              )}

              {/* Success or Failure Message */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {status ? "Habit Completed!" : "Habit Not Completed"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {status
                  ? "You've done a great job today. Keep it up!"
                  : "It's okay to have off days. Tomorrow is a new opportunity!"}
              </p>

              {/* Motivational Quote */}
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                {motivationalQuote}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HabitmoodForm;