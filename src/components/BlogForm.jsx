import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const MAX_CONTENT_LENGTH = 5000;

const BlogForm = ({ initialData = null, onSubmit }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.trim().length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Content must be ${MAX_CONTENT_LENGTH} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, content]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      setSubmitting(true);

      const result = onSubmit({
        title: title.trim(),
        content: content.trim(),
      });

      if (result && result.error) {
        setErrors({ form: result.error });
        setSubmitting(false);
      }
    },
    [title, content, validate, onSubmit]
  );

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {errors.form}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: undefined }));
            }
          }}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter post title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <span
            className={`text-xs ${
              content.trim().length > MAX_CONTENT_LENGTH
                ? 'text-red-600'
                : 'text-gray-500'
            }`}
          >
            {content.trim().length} / {MAX_CONTENT_LENGTH}
          </span>
        </div>
        <textarea
          id="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) {
              setErrors((prev) => ({ ...prev, content: undefined }));
            }
          }}
          rows={10}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y ${
            errors.content ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Write your blog post content..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? 'Saving...'
            : initialData
            ? 'Update Post'
            : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BlogForm;