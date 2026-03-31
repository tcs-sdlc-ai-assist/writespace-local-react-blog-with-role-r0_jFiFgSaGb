import { useMemo, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostById, deletePost } from '../services/blogService';
import { useSession } from '../context/SessionContext';
import Avatar from '../components/Avatar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useSession();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState('');

  const post = useMemo(() => {
    return getPostById(id);
  }, [id]);

  const canEdit = useMemo(() => {
    if (!post || !user) return false;
    return isAdmin || post.authorId === user.username;
  }, [post, user, isAdmin]);

  const formattedDate = useMemo(() => {
    if (!post) return '';
    return new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [post]);

  const handleDelete = useCallback(() => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }

    const result = deletePost(id, user);

    if (result.error) {
      setError(result.error);
      setConfirmingDelete(false);
      return;
    }

    navigate('/blogs', { replace: true });
  }, [confirmingDelete, id, user, navigate]);

  const handleCancelDelete = useCallback(() => {
    setConfirmingDelete(false);
  }, []);

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
              The post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              &larr; Back to Blogs
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to="/blogs"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              &larr; Back to Blogs
            </Link>
          </div>

          <article className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar
                    role={post.authorId === 'admin' ? 'admin' : 'viewer'}
                    size="md"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {post.authorName}
                    </p>
                    <p className="text-xs text-gray-500">{formattedDate}</p>
                  </div>
                </div>

                {canEdit && (
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/blogs/${post.id}/edit`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Edit
                    </Link>
                    {confirmingDelete ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDelete}
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
                        onClick={handleDelete}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6">
                  {error}
                </div>
              )}

              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;