import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <div className="w-1/2 p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </h2>
      <form>
        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="text"
            id="username"
            placeholder="Enter your username"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            type="password"
            id="password"
            placeholder="Enter your password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {type === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>

      {/* Forgot Password Link */}
      {type === 'login' && (
        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      )}

      {/* Line Break */}
      <hr className="my-6 border-gray-300" />

      {/* Sign Up / Login Link */}
      <div className="text-center">
        <p className="text-gray-600">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Link
          href={type === 'login' ? '/auth/signup' : '/auth/login'}
          className="text-blue-600 hover:underline font-semibold"
        >
          {type === 'login' ? 'Sign Up' : 'Login'}
        </Link>
      </div>
    </div>
  );
}