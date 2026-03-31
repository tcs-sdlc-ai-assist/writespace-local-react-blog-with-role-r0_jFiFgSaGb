import { useState, useCallback } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Footer from '../components/Footer';

const LoginPage = () => {
  const { login, isAuthenticated, isAdmin } = useSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError('');
      setSubmitting(true);

      const result = login(username, password);

      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      if (result.user && result.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    },
    [username, password, login, navigate]
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
              Welcome back
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Sign in to your account to continue
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-sm text-gray-600 text-center mt-5">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Get Started
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;