import { useState, useCallback } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const { register, isAuthenticated, isAdmin } = useSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError('');
      setSubmitting(true);

      const result = register(username, password, confirmPassword);

      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      navigate('/blogs', { replace: true });
    },
    [username, password, confirmPassword, register, navigate]
  );

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/blogs'} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
            >
              WriteSpace
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              Create your account
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Sign up to start writing and sharing your thoughts
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating account...' : 'Get Started'}
              </button>
            </form>

            <p className="text-sm text-gray-600 text-center mt-5">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;