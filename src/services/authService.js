import { getItem, setItem, removeItem } from './localStorageService';
import { getAllUsers, createUser } from './userService';

const SESSION_KEY = 'session';

export const login = (username, password) => {
  if (!username || !username.trim()) {
    return { user: null, error: 'Username is required' };
  }
  if (!password || !password.trim()) {
    return { user: null, error: 'Password is required' };
  }

  const users = getAllUsers();
  const user = users.find(
    (u) =>
      u.username.toLowerCase() === username.trim().toLowerCase() &&
      u.password === password
  );

  if (!user) {
    return { user: null, error: 'Invalid credentials' };
  }

  const session = {
    username: user.username,
    role: user.role,
  };
  setItem(SESSION_KEY, session);

  return { user: session, error: null };
};

export const register = (username, password, confirmPassword) => {
  if (!username || !username.trim()) {
    return { user: null, error: 'Username is required' };
  }
  if (!password || !password.trim()) {
    return { user: null, error: 'Password is required' };
  }
  if (!confirmPassword || !confirmPassword.trim()) {
    return { user: null, error: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { user: null, error: 'Passwords do not match' };
  }

  const result = createUser(username, password, 'viewer');

  if (result.error) {
    return { user: null, error: result.error };
  }

  const session = {
    username: result.user.username,
    role: result.user.role,
  };
  setItem(SESSION_KEY, session);

  return { user: session, error: null };
};

export const logout = () => {
  removeItem(SESSION_KEY);
};

export const getSession = () => {
  const session = getItem(SESSION_KEY);
  if (!session || !session.username || !session.role) {
    return null;
  }
  return session;
};