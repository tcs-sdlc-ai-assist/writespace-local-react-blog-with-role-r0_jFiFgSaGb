export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item);
  } catch {
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silent fail — localStorage may be full or unavailable
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silent fail — localStorage may be unavailable
  }
};