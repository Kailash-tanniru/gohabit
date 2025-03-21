import React, { useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import HabitmoodForm from './HabitmoodForm';
import { useHabitStore } from '@/lib/stores/habitStore';

const HabitActionComponent = ({ habitId}) => {
    const [isDone, setIsDone] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [mood, setMood] = useState('');
    const [journalEntry, setJournalEntry] = useState('');
    const {toggleHabitCompletion}=  useHabitStore()




    // const handleToggleDone = async (habitId:number,mood:string,notes:string) => {
    //     console.log(mood)
    //     console.log(notes)
    
    //     try {
    //       await toggleHabitCompletion(habitId, true,mood,notes);
    //       setShowConfetti(true);
    //       setTimeout(() => setShowConfetti(false), 5000);
    //     } catch (err) {
    //       console.error("Failed to mark as done:", err);
    //     }
    //   };
    const handleToggleDone = (status:boolean) => {
        setIsDone(status);
        setShowModal(true); // Show the modal when status is toggled

      };
      const handleMoodSelection = (selectedMood:string) => {
        console.log(selectedMood)
        setMood(selectedMood);
      };

      const handleOnclose = ()=>{
        setShowModal(false)
      }
    
      // Handle journal entry submission
      const handleSubmit = async () => {
        // Save mood and journal entry (you can send this data to an API or state management)
        try{
            await toggleHabitCompletion(habitId,isDone,mood,journalEntry);
        }
        catch(err){
            console.log("Failed to mark as done",err);
        }
    
        // Close the modal
        setShowModal(false);
        setMood('');
        setJournalEntry('');
      };
  return (
    <div>
            <div className="mt-2 flex justify-center w-full">
              <div className="flex items-center bg-white rounded-lg shadow-sm p-3 border border-gray-200">
                <span className="text-sm font-medium text-gray-700 mr-3">Task Status</span>
                <div className="flex space-x-2">
                  <div
                    className={`p-1.5 rounded-full ${
                      isDone ? 'bg-green-600 text-green-200' : 'bg-gray-100 text-green-500'
                    } hover:bg-green-100 transition-colors cursor-pointer`}
                    onClick={() => handleToggleDone(true)}
                  >
                    <FaCheck className="w-4 h-4" />
                  </div>
                  <div
                    className={`p-1.5 rounded-full ${
                      !isDone ? 'bg-red-200 text-red-600' : 'bg-gray-100 text-gray-500'
                    } hover:bg-red-100 transition-colors cursor-pointer`}
                    onClick={() => handleToggleDone(false)}
                  >
                    <FaTimes className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
            {
      showModal && 
      <HabitmoodForm  journalEntry={journalEntry} handleMoodSelection={handleMoodSelection} mood={mood} handleSubmit={handleSubmit}  setJournalEntry={setJournalEntry} onClose={handleOnclose} status={isDone}/>
      }
    </div>
  )
}

export default HabitActionComponent
