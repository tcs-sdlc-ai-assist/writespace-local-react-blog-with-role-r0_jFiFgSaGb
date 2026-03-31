import { useMemo, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getPostById, editPost } from '../services/blogService';
import { useSession } from '../context/SessionContext';
import BlogForm from '../components/BlogForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useSession();

  const post = useMemo(() => {
    return getPostById(id);
  }, [id]);

  const canEdit = useMemo(() => {
    if (!post || !user) return false;
    return isAdmin || post.authorId === user.username;
  }, [post, user, isAdmin]);

  const handleSubmit = useCallback(
    (formData) => {
      const result = editPost(id, formData, user);

      if (result.error) {
        return { error: result.error };
      }

      navigate(`/blogs/${id}`, { replace: true });
    },
    [id, user, navigate]
  );

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Post not found
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              The post you&apos;re trying to edit doesn&apos;t exist or has been removed.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!canEdit) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Edit Post
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Update your blog post
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <BlogForm initialData={post} onSubmit={handleSubmit} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogEditPage;