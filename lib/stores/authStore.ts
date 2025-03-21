import { create } from 'zustand';
import api from '../api';

interface User {
  id: number;
  username: string;
  email: string;
  is_email_verified: boolean;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  verifyPasswordResetOTP: (email: string, otp: string) => Promise<boolean>;
  verifyEmailWithOTP: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  fetchUserDetails: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  refreshToken: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        '/api/token/refresh/',
        {}, // No body needed if refresh token is stored in cookies
        { withCredentials: true } // Ensure cookies are sent
      );

      if (response.status === 200) {
        // Token refreshed successfully (backend updates the HTTP-only cookie)
        set({ error: null });
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to refresh token', isAuthenticated: false, user: null });
      throw err; // Re-throw the error to handle it in the calling function
    } finally {
      set({ loading: false });
    }
  },
  fetchUserDetails: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get('/api/user/details/', {
        withCredentials: true,
      });

      if (response.status === 200) {
        set({ user: response.data.user, isAuthenticated: true, error: null });
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch user details', isAuthenticated: false, user: null });
    } finally {
      set({ loading: false });
    }
  },

  // Login user
  login: async (username, password) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        '/api/login/',
        { username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update the state with the authenticated user
        set({ user: response.data.user, isAuthenticated: true, error: null });
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err) {
      // Handle errors
      set({ error: err instanceof Error ? err.message : 'Login failed', isAuthenticated: false, user: null });
    } finally {
      set({ loading: false });
    }
  },

  // Register user
  register: async (username, email, password) => {
    set({ loading: true, error: null });

    try {
      
      const response = await api.post(
        '/api/register/',
        { username, email, password },
        { withCredentials: true }
      );

      if (response.status === 201) {
        // User is registered but not authenticated until email is verified
        set({ user: response.data.user, isAuthenticated: false, error: null });
        return true; // Registration successful
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Registration failed' });
      return false; // Registration failed
    } finally {
      set({ loading: false });
    }
  },

  // Logout user
  logout: async () => {
    set({ loading: true, error: null });

    try {
      await api.post('/api/logout/', {}, { withCredentials: true });
      set({ user: null, isAuthenticated: false, error: null });

    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Logout failed' });
    } finally {
      set({ loading: false });
    }
  },

  // Verify authentication
  verifyAuth: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get('/api/auth/verify/', {
        withCredentials: true,
      });

      if (response.status === 200) {
        set({ user: response.data.user, isAuthenticated: true, error: null });
      } else {
        throw new Error('Authentication verification failed');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      set({ user: null, isAuthenticated: false, error: null });
    } finally {
      set({ loading: false });
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        '/api/password-reset-request/',
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        return true; // OTP sent successfully
      } else {
        throw new Error(response.data.error || 'Password reset request failed');
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Password reset request failed' });
      return false; // Password reset request failed
    } finally {
      set({ loading: false });
    }
  },

  // Verify password reset OTP
  verifyPasswordResetOTP: async (email, otp) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        '/api/password-reset-verify-otp/',
        { email, otp },
        { withCredentials: true }
      );

      if (response.status === 200) {
        return true; // OTP verified successfully
      } else {
        throw new Error(response.data.error || 'Invalid or expired OTP');
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Invalid or expired OTP' });
      return false; // OTP verification failed
    } finally {
      set({ loading: false });
    }
  },

  // Reset password
  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    set({ loading: true, error: null });

    try {
      // Check if passwords match
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const response = await api.post(
        '/api/password-reset-confirm/',
        { email, otp, new_password: newPassword, confirm_password: confirmPassword },
        { withCredentials: true }
      );

      if (response.status === 200) {
        return true; // Password reset successful
      } else {
        throw new Error(response.data.error || 'Password reset failed');
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Password reset failed' });
      return false; // Password reset failed
    } finally {
      set({ loading: false });
    }
  },

  // Verify email with OTP
  verifyEmailWithOTP: async (email, otp) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post(
        '/api/verify-email-with-otp/',
        { email, otp },
        { withCredentials: true }
      );

      if (response.status === 200) {
        set({ user: response.data.user, isAuthenticated: true, error: null }); // Mark email as verified
        return true; // Email verification successful
      } else {
        throw new Error(response.data.error || 'Email verification failed');
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Email verification failed' });
      return false; // Email verification failed
    } finally {
      set({ loading: false });
    }
  },
}));