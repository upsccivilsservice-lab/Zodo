
import React from 'react';
import { User } from '../types';
import { formatDistance } from '../utils/geo';
import { MessageCircle } from 'lucide-react';

interface NearbyListProps {
  users: User[];
  onSelect: (user: User) => void;
}

const NearbyList: React.FC<NearbyListProps> = ({ users, onSelect }) => {
  const nearbyOnly = users.filter((u) => u.distance! <= 1000);
  const outOfRange = users.filter((u) => u.distance! > 1000);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Active Nearby
        </h2>
        <div className="space-y-3">
          {nearbyOnly.length > 0 ? (
            nearbyOnly.map((user) => (
              <UserCard key={user.id} user={user} onSelect={onSelect} />
            ))
          ) : (
            <div className="text-center py-10 text-rose-300 font-medium">
              Nobody in range right now. Try moving a bit!
            </div>
          )}
        </div>
      </div>

      {outOfRange.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-rose-400/60 mb-4">Just Out of Reach</h2>
          <div className="space-y-3 opacity-60">
            {outOfRange.map((user) => (
              <UserCard key={user.id} user={user} onSelect={onSelect} isOutOfRange />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const UserCard: React.FC<{ user: User; onSelect: (u: User) => void; isOutOfRange?: boolean }> = ({ user, onSelect, isOutOfRange }) => (
  <div
    onClick={() => !isOutOfRange && onSelect(user)}
    className={`group flex items-center gap-4 bg-white/70 p-4 rounded-3xl border border-rose-100/50 shadow-sm hover:shadow-md transition-all cursor-pointer ${
      isOutOfRange ? 'grayscale pointer-events-none' : 'hover:scale-[1.02] active:scale-95'
    }`}
  >
    <div className="relative">
      <img src={user.avatar} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-50" alt={user.name} />
      {!isOutOfRange && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />}
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-rose-900">{user.name}</h3>
      <span className="inline-block px-2 py-0.5 rounded-full bg-rose-50 text-[10px] font-bold text-rose-500 uppercase tracking-wider">
        {formatDistance(user.distance!)}
      </span>
    </div>
    {!isOutOfRange && (
      <div className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-400 rounded-2xl group-hover:bg-rose-400 group-hover:text-white transition-colors">
        <MessageCircle size={20} />
      </div>
    )}
  </div>
);

export default NearbyList;
