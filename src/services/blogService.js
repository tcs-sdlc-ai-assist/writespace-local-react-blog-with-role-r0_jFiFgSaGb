import { getItem, setItem } from './localStorageService';

const POSTS_KEY = 'posts';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const generateExcerpt = (content) => {
  if (!content) return '';
  return content.length > 150 ? content.substring(0, 150) + '...' : content;
};

export const getAllPosts = () => {
  const posts = getItem(POSTS_KEY);
  if (!posts || !Array.isArray(posts)) {
    return [];
  }
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getPostById = (id) => {
  if (!id) {
    return null;
  }
  const posts = getItem(POSTS_KEY);
  if (!posts || !Array.isArray(posts)) {
    return null;
  }
  return posts.find((p) => p.id === id) || null;
};

export const createPost = (post, author) => {
  if (!post || !post.title || !post.title.trim()) {
    return { post: null, error: 'Title is required' };
  }
  if (!post || !post.content || !post.content.trim()) {
    return { post: null, error: 'Content is required' };
  }
  if (post.content.trim().length > 5000) {
    return { post: null, error: 'Content must be 5000 characters or less' };
  }
  if (!author || !author.username) {
    return { post: null, error: 'Author is required' };
  }

  const posts = getItem(POSTS_KEY) || [];

  const newPost = {
    id: generateId(),
    title: post.title.trim(),
    content: post.content.trim(),
    excerpt: generateExcerpt(post.content.trim()),
    authorId: author.username,
    authorName: author.username,
    date: new Date().toISOString(),
  };

  const updated = [...posts, newPost];
  setItem(POSTS_KEY, updated);

  return { post: newPost, error: null };
};

export const editPost = (id, updates, user) => {
  if (!id) {
    return { post: null, error: 'Post ID is required' };
  }
  if (!updates || !updates.title || !updates.title.trim()) {
    return { post: null, error: 'Title is required' };
  }
  if (!updates || !updates.content || !updates.content.trim()) {
    return { post: null, error: 'Content is required' };
  }
  if (updates.content.trim().length > 5000) {
    return { post: null, error: 'Content must be 5000 characters or less' };
  }
  if (!user || !user.username) {
    return { post: null, error: 'User is required' };
  }

  const posts = getItem(POSTS_KEY) || [];
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return { post: null, error: 'Post not found' };
  }

  const existingPost = posts[postIndex];

  if (user.role !== 'admin' && existingPost.authorId !== user.username) {
    return { post: null, error: 'You do not have permission to edit this post' };
  }

  const updatedPost = {
    ...existingPost,
    title: updates.title.trim(),
    content: updates.content.trim(),
    excerpt: generateExcerpt(updates.content.trim()),
    date: new Date().toISOString(),
  };

  const updated = [...posts];
  updated[postIndex] = updatedPost;
  setItem(POSTS_KEY, updated);

  return { post: updatedPost, error: null };
};

export const deletePost = (id, user) => {
  if (!id) {
    return { success: false, error: 'Post ID is required' };
  }
  if (!user || !user.username) {
    return { success: false, error: 'User is required' };
  }

  const posts = getItem(POSTS_KEY) || [];
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return { success: false, error: 'Post not found' };
  }

  if (user.role !== 'admin' && post.authorId !== user.username) {
    return { success: false, error: 'You do not have permission to delete this post' };
  }

  const updated = posts.filter((p) => p.id !== id);
  setItem(POSTS_KEY, updated);

  return { success: true, error: null };
};