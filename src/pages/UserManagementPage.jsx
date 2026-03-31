import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, createUser, deleteUser } from '../services/userService';
import { useSession } from '../context/SessionContext';
import Avatar from '../components/Avatar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserManagementPage = () => {
  const { user } = useSession();
  const navigate = useNavigate();

  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmingDeleteUsername, setConfirmingDeleteUsername] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Create user form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('viewer');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const users = useMemo(() => {
    return getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const handleCreateUser = useCallback(
    (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');

      const newErrors = {};

      if (!newUsername.trim()) {
        newErrors.username = 'Username is required';
      }

      if (!newPassword.trim()) {
        newErrors.password = 'Password is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setFormErrors(newErrors);
        return;
      }

      setSubmitting(true);
      setFormErrors({});

      const result = createUser(newUsername.trim(), newPassword, newRole);

      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      setSuccess(`User "${result.user.username}" created successfully`);
      setNewUsername('');
      setNewPassword('');
      setNewRole('viewer');
      setSubmitting(false);
      setRefreshKey((prev) => prev + 1);
    },
    [newUsername, newPassword, newRole]
  );

  const handleDelete = useCallback(
    (username) => {
      setError('');
      setSuccess('');

      if (confirmingDeleteUsername !== username) {
        setConfirmingDeleteUsername(username);
        return;
      }

      const result = deleteUser(username, user);

      if (result.error) {
        setError(result.error);
        setConfirmingDeleteUsername(null);
        return;
      }

      setSuccess(`User "${username}" deleted successfully`);
      setConfirmingDeleteUsername(null);
      setRefreshKey((prev) => prev + 1);
    },
    [confirmingDeleteUsername, user]
  );

  const handleCancelDelete = useCallback(() => {
    setConfirmingDeleteUsername(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        {/* Gradient Banner */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
            <p className="text-sm text-white/80 mt-1">
              Manage platform users, create new accounts, and assign roles.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-6">
              {success}
            </div>
          )}

          {/* Create User Form */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create New User
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="newUsername"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      id="newUsername"
                      type="text"
                      value={newUsername}
                      onChange={(e) => {
                        setNewUsername(e.target.value);
                        if (formErrors.username) {
                          setFormErrors((prev) => ({
                            ...prev,
                            username: undefined,
                          }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.username
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter username"
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (formErrors.password) {
                          setFormErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors.password
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="newRole"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role
                    </label>
                    <select
                      id="newRole"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>
          </div>

          {/* Users List */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              All Users ({users.length})
            </h2>

            {users.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                          User
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                          Role
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, index) => {
                        const isDefaultAdmin =
                          u.username.toLowerCase() === 'admin';
                        const isSelf =
                          u.username.toLowerCase() ===
                          user.username.toLowerCase();
                        const canDelete = !isDefaultAdmin && !isSelf;

                        return (
                          <tr
                            key={u.username}
                            className={
                              index < users.length - 1
                                ? 'border-b border-gray-100'
                                : ''
                            }
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar role={u.role} size="sm" />
                                <span className="text-sm font-medium text-gray-900">
                                  {u.username}
                                </span>
                                {isSelf && (
                                  <span className="text-xs font-medium text-gray-500">
                                    (you)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  u.role === 'admin'
                                    ? 'bg-violet-100 text-violet-700'
                                    : 'bg-indigo-100 text-indigo-700'
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {canDelete ? (
                                confirmingDeleteUsername === u.username ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleDelete(u.username)}
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
                                    onClick={() => handleDelete(u.username)}
                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                  >
                                    Delete
                                  </button>
                                )
                              ) : (
                                <span className="text-xs text-gray-400">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {users.map((u) => {
                    const isDefaultAdmin =
                      u.username.toLowerCase() === 'admin';
                    const isSelf =
                      u.username.toLowerCase() ===
                      user.username.toLowerCase();
                    const canDelete = !isDefaultAdmin && !isSelf;

                    return (
                      <div
                        key={u.username}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar role={u.role} size="md" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {u.username}
                                </span>
                                {isSelf && (
                                  <span className="text-xs font-medium text-gray-500">
                                    (you)
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  u.role === 'admin'
                                    ? 'bg-violet-100 text-violet-700'
                                    : 'bg-indigo-100 text-indigo-700'
                                }`}
                              >
                                {u.role}
                              </span>
                            </div>
                          </div>

                          {canDelete && (
                            <div>
                              {confirmingDeleteUsername === u.username ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleDelete(u.username)}
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
                                  onClick={() => handleDelete(u.username)}
                                  className="text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-sm text-gray-600">
                  Create a new user to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserManagementPage;