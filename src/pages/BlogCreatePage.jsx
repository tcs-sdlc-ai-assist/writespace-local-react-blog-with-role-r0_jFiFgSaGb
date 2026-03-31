import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/blogService';
import { useSession } from '../context/SessionContext';
import BlogForm from '../components/BlogForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useSession();

  const handleSubmit = useCallback(
    (formData) => {
      const result = createPost(formData, user);

      if (result.error) {
        return { error: result.error };
      }

      navigate('/blogs', { replace: true });
    },
    [user, navigate]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create New Post
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Share your thoughts with the community
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <BlogForm onSubmit={handleSubmit} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogCreatePage;