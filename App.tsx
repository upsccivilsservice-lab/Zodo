
import React, { useState, useEffect, useCallback } from 'react';
import { User, AppTab, Location } from './types';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import NearbyList from './components/NearbyList';
import MapView from './components/MapView';
import ChatWindow from './components/ChatWindow';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import { MOCK_CURRENT_USER, getMockNearbyUsers, MOCK_CHATS } from './services/mockApi';
import { calculateDistance } from './utils/geo';
import { MessageSquare, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.NEARBY);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_CURRENT_USER);
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [isLocationReady, setIsLocationReady] = useState(false);

  // Tracking geolocation
  useEffect(() => {
    if (!isAuthenticated) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentUser((prev) => ({ ...prev, location: newLocation }));
        setIsLocationReady(true);
      },
      (error) => {
        console.error("Location error", error);
        // Fallback for demo if location denied
        const fallback: Location = { lat: 34.0522, lng: -118.2437 }; // LA
        setCurrentUser((prev) => ({ ...prev, location: fallback }));
        setIsLocationReady(true);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isAuthenticated]);

  // Update nearby users based on distance
  useEffect(() => {
    if (!isLocationReady) return;

    const rawUsers = getMockNearbyUsers(currentUser.location);
    const usersWithDistance = rawUsers.map((u) => ({
      ...u,
      distance: calculateDistance(currentUser.location, u.location),
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

    setNearbyUsers(usersWithDistance);
  }, [currentUser.location, isLocationReady]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const toggleGhostMode = () => {
    setCurrentUser(prev => ({ ...prev, isGhostMode: !prev.isGhostMode }));
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const getTabTitle = () => {
    switch(activeTab) {
      case AppTab.NEARBY: return 'Discover';
      case AppTab.MAP: return 'Explore';
      case AppTab.CHATS: return 'Inbox';
      case AppTab.PROFILE: return 'Me';
      case AppTab.SETTINGS: return 'Settings';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-rose-50/10">
      {/* Header Area - Hidden on Settings page for custom header */}
      {activeTab !== AppTab.SETTINGS && (
        <header className="px-6 pt-10 pb-4 bg-white/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-rose-900 flex items-center gap-2">
                Lumina
                <div className={`w-2 h-2 rounded-full ${currentUser.isGhostMode ? 'bg-slate-400' : 'bg-rose-500 animate-pulse'}`} />
              </h1>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                {getTabTitle()}
              </p>
            </div>
            <button 
              onClick={() => setActiveTab(AppTab.PROFILE)}
              className={`w-12 h-12 rounded-2xl p-0.5 shadow-lg transition-all duration-300 ${activeTab === AppTab.PROFILE ? 'ring-4 ring-rose-200 scale-110' : ''} ${currentUser.isGhostMode ? 'bg-slate-400 grayscale' : 'bg-gradient-to-br from-rose-200 to-rose-400'}`}
            >
              <img src={currentUser.avatar} className="w-full h-full rounded-[0.9rem] object-cover" alt="Profile" />
            </button>
          </div>
        </header>
      )}

      {/* Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col pb-28">
        {!isLocationReady ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-400 rounded-full animate-spin" />
            <p className="text-rose-900 font-bold">Finding your lovely spot...</p>
            <p className="text-sm text-rose-400">Make sure location access is enabled.</p>
          </div>
        ) : (
          <>
            {activeTab === AppTab.NEARBY && (
              <NearbyList users={nearbyUsers} onSelect={setSelectedChatUser} />
            )}
            
            {activeTab === AppTab.MAP && (
              <MapView 
                currentUser={currentUser} 
                nearbyUsers={nearbyUsers} 
                onSelectUser={setSelectedChatUser} 
              />
            )}

            {activeTab === AppTab.CHATS && (
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {MOCK_CHATS.map((chat) => {
                  const partner = nearbyUsers.find(u => u.id === chat.participants.find(id => id !== 'me')) || {
                    name: 'Mystery User',
                    avatar: 'https://picsum.photos/seed/mystery/100',
                  };
                  return (
                    <div 
                      key={chat.id}
                      onClick={() => setSelectedChatUser(partner as User)}
                      className="flex items-center gap-4 bg-white/70 p-4 rounded-3xl border border-rose-100/50 shadow-sm hover:scale-[1.01] transition-transform cursor-pointer"
                    >
                      <img src={partner.avatar} className="w-14 h-14 rounded-2xl object-cover" alt={partner.name} />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-rose-900">{partner.name}</h3>
                          <span className="text-[10px] text-rose-300 font-bold flex items-center gap-1">
                            <Clock size={10} />
                            1h ago
                          </span>
                        </div>
                        <p className="text-sm text-rose-400 truncate mt-1">
                          {chat.lastMessage?.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === AppTab.PROFILE && (
              <ProfileView 
                user={currentUser} 
                onNavigate={(tab) => setActiveTab(tab)} 
              />
            )}

            {activeTab === AppTab.SETTINGS && (
              <SettingsView 
                user={currentUser} 
                onToggleGhostMode={toggleGhostMode} 
                onBack={() => setActiveTab(AppTab.PROFILE)} 
              />
            )}
          </>
        )}
      </main>

      {/* Overlay Screens */}
      {selectedChatUser && (
        <ChatWindow 
          user={selectedChatUser} 
          onClose={() => setSelectedChatUser(null)} 
          currentUserLocation={currentUser.location}
        />
      )}

      {/* Navigation */}
      <Navbar activeTab={activeTab === AppTab.SETTINGS ? AppTab.PROFILE : activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
