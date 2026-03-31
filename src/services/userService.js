import { getItem, setItem } from './localStorageService';

const USERS_KEY = 'users';

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  role: 'admin',
};

const ensureDefaultAdmin = () => {
  const users = getItem(USERS_KEY);
  if (users === null) {
    setItem(USERS_KEY, [DEFAULT_ADMIN]);
    return [DEFAULT_ADMIN];
  }
  const hasAdmin = users.some(
    (u) => u.username.toLowerCase() === DEFAULT_ADMIN.username.toLowerCase()
  );
  if (!hasAdmin) {
    const updated = [DEFAULT_ADMIN, ...users];
    setItem(USERS_KEY, updated);
    return updated;
  }
  return users;
};

export const getAllUsers = () => {
  return ensureDefaultAdmin();
};

export const createUser = (username, password, role) => {
  if (!username || !username.trim()) {
    return { user: null, error: 'Username is required' };
  }
  if (!password || !password.trim()) {
    return { user: null, error: 'Password is required' };
  }
  if (role !== 'admin' && role !== 'viewer') {
    return { user: null, error: 'Role must be admin or viewer' };
  }

  const users = ensureDefaultAdmin();
  const exists = users.some(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );
  if (exists) {
    return { user: null, error: 'Username is already taken' };
  }

  const newUser = {
    username: username.trim(),
    password,
    role,
  };

  const updated = [...users, newUser];
  setItem(USERS_KEY, updated);

  return { user: newUser, error: null };
};

export const deleteUser = (username, currentUser) => {
  if (!username) {
    return { success: false, error: 'Username is required' };
  }
  if (!currentUser || currentUser.role !== 'admin') {
    return { success: false, error: 'Only admins can delete users' };
  }
  if (username.toLowerCase() === DEFAULT_ADMIN.username.toLowerCase()) {
    return { success: false, error: 'Cannot delete the default admin' };
  }
  if (username.toLowerCase() === currentUser.username.toLowerCase()) {
    return { success: false, error: 'Cannot delete your own account' };
  }

  const users = ensureDefaultAdmin();
  const userExists = users.some(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (!userExists) {
    return { success: false, error: 'User not found' };
  }

  const updated = users.filter(
    (u) => u.username.toLowerCase() !== username.toLowerCase()
  );
  setItem(USERS_KEY, updated);

  return { success: true, error: null };
};