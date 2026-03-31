import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Avatar from './Avatar';

const BlogCard = memo(({ post }) => {
  const { user, isAdmin } = useSession();

  const canEdit =
    isAdmin || (user && post.authorId === user.username);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar
              role={post.authorId === 'admin' ? 'admin' : 'viewer'}
              size="sm"
            />
            <span className="text-sm font-medium text-gray-700">
              {post.authorName}
            </span>
          </div>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        <Link to={`/blogs/${post.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 mb-2 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <Link
            to={`/blogs/${post.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Read more
          </Link>

          {canEdit && (
            <Link
              to={`/blogs/${post.id}/edit`}
              className="text-gray-400 hover:text-indigo-600"
              aria-label={`Edit ${post.title}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;