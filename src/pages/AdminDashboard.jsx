import { useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts, deletePost } from '../services/blogService';
import { getAllUsers } from '../services/userService';
import { useSession } from '../context/SessionContext';
import StatCard from '../components/StatCard';
import Avatar from '../components/Avatar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const { user } = useSession();
  const navigate = useNavigate();
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [error, setError] = useState('');

  const posts = useMemo(() => {
    return getAllPosts();
  }, []);

  const users = useMemo(() => {
    return getAllUsers();
  }, []);

  const recentPosts = useMemo(() => {
    return posts.slice(0, 5);
  }, [posts]);

  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalUsers = users.length;
    const adminsCount = users.filter((u) => u.role === 'admin').length;
    const viewersCount = users.filter((u) => u.role === 'viewer').length;
    return { totalPosts, totalUsers, adminsCount, viewersCount };
  }, [posts, users]);

  const handleDelete = useCallback(
    (id) => {
      if (confirmingDeleteId !== id) {
        setConfirmingDeleteId(id);
        setError('');
        return;
      }

      const result = deletePost(id, user);

      if (result.error) {
        setError(result.error);
        setConfirmingDeleteId(null);
        return;
      }

      setConfirmingDeleteId(null);
      setError('');
      navigate(0);
    },
    [confirmingDeleteId, user, navigate]
  );

  const handleCancelDelete = useCallback(() => {
    setConfirmingDeleteId(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        {/* Gradient Banner */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-white/80 mt-1">
              Welcome back, {user.username}. Here&apos;s an overview of your platform.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Posts"
              count={stats.totalPosts}
              emoji="📝"
              gradient="from-indigo-500 to-indigo-600"
            />
            <StatCard
              label="Total Users"
              count={stats.totalUsers}
              emoji="👥"
              gradient="from-violet-500 to-violet-600"
            />
            <StatCard
              label="Admins"
              count={stats.adminsCount}
              emoji="👑"
              gradient="from-amber-500 to-amber-600"
            />
            <StatCard
              label="Viewers"
              count={stats.viewersCount}
              emoji="📖"
              gradient="from-emerald-500 to-emerald-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex items-center gap-4">
              <Link
                to="/blogs/new"
                className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700"
              >
                Write a Post
              </Link>
              <Link
                to="/blogs"
                className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50"
              >
                View All Posts
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Posts
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            {recentPosts.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {recentPosts.map((post, index) => {
                  const formattedDate = new Date(post.date).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }
                  );

                  return (
                    <div
                      key={post.id}
                      className={`flex items-center justify-between p-4 ${
                        index < recentPosts.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          role={post.authorId === 'admin' ? 'admin' : 'viewer'}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/blogs/${post.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate block"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-gray-500">
                            by {post.authorName} &middot; {formattedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <Link
                          to={`/blogs/${post.id}/edit`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Edit
                        </Link>
                        {confirmingDeleteId === post.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="text-sm font-medium text-red-600 hover:text-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              className="text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Get started by creating the first post on the platform.
                </p>
                <Link
                  to="/blogs/new"
                  className="bg-indigo-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-indigo-700"
                >
                  Create Your First Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;