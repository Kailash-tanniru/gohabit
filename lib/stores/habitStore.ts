import { create } from 'zustand';
import api from '../api';



interface User {
  id: number;
  username: string;
  email: string;
}

interface HabitLog {
  id: number;
  habitId: number;
  date: string;
  mood: string;
  notes: string;
  completed: boolean;
}

interface Habit {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  reminder_toggle: boolean;
  reminder_type?: string;
  frequency: string;
  reward?: string;
  is_important: boolean;
  is_completed_today?: boolean;
  current_streak: number;
  max_streak: number;
  isActive: boolean;
  streak_updated_at?: string;
  message: string;
  is_achieved:boolean;
  logs?: HabitLog[];
}

interface HabitStore {
  habits: Habit[];
  habitLogs: HabitLog[];
  loading: boolean;
  error: string | null;
  user: User | null;
  fetchUserData: () => Promise<void>;
  fetchHabits: () => Promise<void>;
  fetchHabitLogs: (habitId: number, date: string) => Promise<HabitLog[] | null>;
  createHabit: (habitData: Omit<Habit, 'id'>) => Promise<void>;
  toggleHabitCompletion: (id: number, completed: boolean, mood: string, notes: string) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  updateHabit: (id: number, habitData: Partial<Habit>) => Promise<void>;


  
}

export const useHabitStore = create<HabitStore>((set) => ({
  habits: [],
  habitLogs: [],
  loading: false,
  error: null,
  user: null,

  // Fetch user data
  fetchUserData: async () => {
    set({ loading: true });
    try {
      
      const response = await api.get('/api/user/details/', { withCredentials: true });
      if (response.data?.user) {
        set({ user: response.data.user });
      } else {
        throw new Error('Invalid user data');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ error: 'Failed to fetch user details.' });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch habits

 




  // Toggle habit completion
  toggleHabitCompletion: async (id, completed, mood, notes) => {
    set({ loading: true });
    try {
    
      const response = await api.post(`/api/habits/${id}/toggle-completion/`, { completed, mood, notes }, { withCredentials: true });
      set((state) => ({
        habits: state.habits.map((h) =>
          h.id === id
            ? {
                ...h,
                message: response.data.message,
                is_completed_today: response.data.is_completed_today,
                current_streak: response.data.current_streak,
                max_streak: response.data.max_streak,
                name: response.data.habit.name,
                description: response.data.habit.description,
                start_date: response.data.habit.start_date,
                end_date: response.data.habit.end_date,
                streak_updated_at: response.data.habit.streak_updated_at,
                is_achieved:response.data.habit.is_achieved
              }
            : h,
        ),
        error: null,
      }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ error: 'Failed to toggle habit completion.' });
    } finally {
      set({ loading: false });
    }
  },

  // Delete a habit
  deleteHabit: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/api/habits/${id}/delete/`);
      set((state) => ({ habits: state.habits.filter((h) => h.id !== id), error: null }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ error: 'Failed to delete habit.' });
    } finally {
      set({ loading: false });
    }
  },

  // Update a habit
  updateHabit: async (id, habitData) => {
    set({ loading: true });
    try {
      const response = await api.patch(`/api/habits/${id}/update/`, habitData);
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? { ...h, ...response.data } : h)),
        error: null,
      }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ error: 'Failed to update habit.' });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch habit logs
  fetchHabitLogs: async (habitId, date) => {
    set({ loading: true });
    try {
      const response = await api.get(`/api/habits/${habitId}/logs/`, { params: { date } });
      console.log(response)
      set({ habitLogs: response.data.logs, error: null });
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ error: 'Failed to fetch habit logs.' });
      return [];
    } finally {
      set({ loading: false });
    }
  },
  fetchHabits: async () => {
    set({ loading: true });
    try {
      const response = await api.get<Habit[]>('/api/habits/', { withCredentials: true });
     
      set({ habits: response.data, error: null });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ error: 'Failed to fetch habits.' });
    } finally {
      set({ loading: false });
    }
  },
    // Create a new habit
    createHabit: async (habitData:Omit<Habit,"id">) => {
      set({ loading: true });
      try {
        const response = await api.post<Habit>('/api/habits/create/', habitData, { withCredentials: true });
        console.log(response)
        set((state) => ({ habits: [...state.habits, response.data], error: null }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        set({ error: 'Failed to create habit.' });
      } finally {
        set({ loading: false });
      }
    },

  
}));