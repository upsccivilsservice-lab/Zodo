
import React from 'react';
import { User, AppTab } from '../types';
import { MapPin, Settings as SettingsIcon, LogOut, Heart, Users, MessageSquare } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onNavigate: (tab: AppTab) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onNavigate }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col items-center text-center space-y-4 py-8">
        <div className="relative">
          <div className={`w-36 h-36 rounded-[3rem] p-1 bg-gradient-to-br transition-all duration-500 ${user.isGhostMode ? 'from-slate-200 to-slate-400 grayscale' : 'from-rose-200 to-rose-400'} shadow-2xl`}>
            <img 
              src={user.avatar} 
              className="w-full h-full rounded-[2.8rem] object-cover border-4 border-white" 
              alt={user.name} 
            />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-rose-900">{user.name}</h2>
          <p className="text-rose-400 text-sm font-semibold flex items-center justify-center gap-1 mt-1">
            <MapPin size={16} /> Local Luminary
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Hearts', val: '12', icon: Heart },
          { label: 'Nearby', val: '5', icon: Users },
          { label: 'Talks', val: '48', icon: MessageSquare },
        ].map((stat, i) => (
          <div key={i} className="bg-white/70 p-4 rounded-3xl border border-rose-100/50 text-center space-y-1 shadow-sm">
            <stat.icon size={16} className="mx-auto text-rose-300" />
            <div className="text-lg font-black text-rose-900 leading-none">{stat.val}</div>
            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => onNavigate(AppTab.SETTINGS)}
          className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-white border border-rose-100 hover:bg-rose-50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400 group-hover:bg-rose-100 transition-colors">
              <SettingsIcon size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-rose-900">Settings</h4>
              <p className="text-xs text-rose-400">Privacy, account, and more</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-rose-100 flex items-center justify-center text-rose-300 group-hover:translate-x-1 transition-transform">
            →
          </div>
        </button>

        <button className="w-full flex items-center justify-center gap-2 py-5 px-6 rounded-[2rem] bg-rose-50 text-rose-400 font-bold hover:bg-rose-100 transition-colors">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      <div className="text-center pb-8 pt-4">
        <p className="text-[10px] text-rose-200 font-bold uppercase tracking-[0.3em]">Lumina • Premium Member</p>
      </div>
    </div>
  );
};

export default ProfileView;
