import { memo } from 'react';

export const getAvatar = (role) => {
  if (role === 'admin') {
    return { emoji: '👑', bg: 'bg-violet-500' };
  }
  return { emoji: '📖', bg: 'bg-indigo-500' };
};

const Avatar = memo(({ role, size = 'md' }) => {
  const { emoji, bg } = getAvatar(role);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`${bg} ${sizeClass} rounded-full flex items-center justify-center`}
      role="img"
      aria-label={`${role} avatar`}
    >
      {emoji}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;