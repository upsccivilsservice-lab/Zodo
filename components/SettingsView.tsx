
import React from 'react';
import { User, AppTab } from '../types';
import { Ghost, ShieldCheck, ChevronLeft, Bell, Lock, User as UserIcon, HelpCircle } from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onToggleGhostMode: () => void;
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onToggleGhostMode, onBack }) => {
  const SettingItem = ({ icon: Icon, title, desc, action, isToggle = false, active = false }: any) => (
    <div className="flex items-center justify-between p-4 bg-white/70 rounded-3xl border border-rose-100/50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-400">
          <Icon size={20} />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-bold text-rose-900 leading-none text-sm">{title}</h4>
          <p className="text-[10px] text-rose-400 leading-none">{desc}</p>
        </div>
      </div>
      {isToggle ? (
        <button 
          onClick={action}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 outline-none ${active ? 'bg-rose-400' : 'bg-rose-200'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
        </button>
      ) : (
        <button className="text-rose-300 hover:text-rose-500">
          <ChevronLeft size={20} className="rotate-180" />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 py-4">
        <button onClick={onBack} className="p-2 hover:bg-rose-50 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-rose-400" />
        </button>
        <h2 className="text-2xl font-black text-rose-900">Settings</h2>
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-rose-300 uppercase tracking-widest px-2">Privacy & Visibility</h3>
          <SettingItem 
            icon={Ghost}
            title="Ghost Mode"
            desc="Hide your presence from the map"
            isToggle={true}
            active={user.isGhostMode}
            action={onToggleGhostMode}
          />
          <SettingItem 
            icon={Lock}
            title="Read Receipts"
            desc="Let others know you saw their message"
            isToggle={true}
            active={true}
            action={() => {}}
          />
        </section>

        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-rose-300 uppercase tracking-widest px-2">Account</h3>
          <SettingItem 
            icon={UserIcon}
            title="Edit Profile"
            desc="Name, Bio, and Avatar"
          />
          <SettingItem 
            icon={ShieldCheck}
            title="Verification"
            desc="Get your Lumina badge"
          />
          <SettingItem 
            icon={Bell}
            title="Notifications"
            desc="Manage alerts and sounds"
          />
        </section>

        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-rose-300 uppercase tracking-widest px-2">Support</h3>
          <SettingItem 
            icon={HelpCircle}
            title="Help Center"
            desc="FAQs and contact support"
          />
        </section>
      </div>

      <div className="text-center py-6">
        <p className="text-[10px] text-rose-200 font-bold uppercase tracking-widest">Version 2.0.26 (Build 445)</p>
      </div>
    </div>
  );
};

export default SettingsView;
