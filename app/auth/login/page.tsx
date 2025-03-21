'use client';


import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import Footer from '@/components/shared/Footer';
import { Suspense } from 'react';
import Image from 'next/image';

// Define the form input types
type LoginFormInputs = {
  username: string;
  password: string;
};

export const dynamic = 'force-dynamic';
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

 function LoginPageContent() {
  const router = useRouter();
  const { login, loading, error,verifyAuth} = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { username, password } = data;
    
    
    await login(username, password);

    

    // 3. Check updated state
    const { isAuthenticated: newAuth, error: newError } = useAuthStore.getState();

    if (newAuth && !newError) {
      console.log('Logged IN successfully');
    
      await verifyAuth()
      router.push('/dashboard');
    } else {
      // You can redirect to /login or show a better error message
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF7FF] flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start md:justify-between gap-8 md:gap-16">
          {/* Left Section - App Info */}
          <div className="w-full md:w-1/2 text-center md:text-left p-4 sm:p-6 md:p-10">
           <Image src='/images/favicon.png' alt='logo' width={120} height={100}/>
            <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 font-lae">GoHabit</h1>
            <p className="text-lg sm:text-xl mt-4 md:mr-10 leading-relaxed">
              Track every habit and achieve success with discipline and consistency.
            </p>
          </div>

          {/* Right Section - Login Form */}
          <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-10 shadow-lg rounded-xl border border-gray-200">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Log In</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="username"
                      {...register('username', { required: 'Username is required' })}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter your username"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="password"
                      id="password"
                      {...register('password', { required: 'Password is required' })}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Login Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 disabled:bg-indigo-300"
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>
                </div>

                {/* Display backend errors */}
                {error && (
                  <p className="mt-2 text-sm text-red-500 text-center">Invalid username or password</p>
                )}
              </form>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-500 transition duration-300"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Divider Line */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link
                  href="/auth/signup"
                  className="text-sm text-gray-600 hover:text-indigo-500 transition duration-300"
                >
                  Don&apos;t have an account?{' '}
                  <span className="font-semibold text-indigo-600">Sign Up</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
