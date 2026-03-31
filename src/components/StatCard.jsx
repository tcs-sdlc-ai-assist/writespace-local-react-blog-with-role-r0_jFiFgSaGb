import { memo } from 'react';

const StatCard = memo(({ label, count, emoji, gradient = 'from-indigo-500 to-indigo-600' }) => {
  return (
    <div
      className={`bg-gradient-to-r ${gradient} rounded-lg p-5 text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{label}</p>
          <p className="text-3xl font-bold mt-1">{count}</p>
        </div>
        <div className="text-3xl">{emoji}</div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;