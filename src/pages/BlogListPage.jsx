import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../services/blogService';
import { useSession } from '../context/SessionContext';
import BlogCard from '../components/BlogCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogListPage = () => {
  const { user } = useSession();

  const posts = useMemo(() => {
    return getAllPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Blog Posts
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Browse the latest posts from the community
              </p>
            </div>
            <Link
              to="/blogs/new"
              className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700"
            >
              New Post
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">✍️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Be the first to share your thoughts with the community!
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
      </main>

      <Footer />
    </div>
  );
};

export default BlogListPage;