import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../services/blogService';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';

const features = [
  {
    emoji: '🔐',
    title: 'Role-Based Access',
    description:
      'Admins and viewers have different permissions. Admins can manage all posts and users, while viewers can create and edit their own content.',
  },
  {
    emoji: '✍️',
    title: 'Easy Blogging',
    description:
      'Create, edit, and delete blog posts with a simple and intuitive interface. Focus on writing, not on complexity.',
  },
  {
    emoji: '💾',
    title: 'Local Storage',
    description:
      'All your data is stored locally in your browser. No server required — your content is always available offline.',
  },
];

const LandingPage = () => {
  const latestPosts = useMemo(() => {
    return getAllPosts().slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            WriteSpace
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            A clean, minimal blogging platform. Share your thoughts, manage your
            content, and connect with readers — all from your browser.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-indigo-600 text-sm font-medium px-6 py-3 rounded-lg hover:bg-gray-100"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-white/30 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            Why WriteSpace?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            Latest Posts
          </h2>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              No posts yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;