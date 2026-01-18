
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { ChevronLeft, Send, AlertCircle, Smile } from 'lucide-react';

interface ChatWindowProps {
  user: User;
  onClose: () => void;
  currentUserLocation: { lat: number, lng: number };
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, onClose, currentUserLocation }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: user.id, text: `Hey! I'm nearby at the park.`, timestamp: Date.now() - 50000 },
  ]);
  const [inputText, setInputText] = useState('');
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Check range logic
    setIsOutOfRange(user.distance! > 1000);
  }, [user.distance]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: Date.now(),
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-rose-50 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0">
        <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-rose-400" />
        </button>
        <div className="flex items-center gap-3">
          <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt={user.name} />
          <div>
            <h3 className="font-bold text-rose-900 text-sm leading-none">{user.name}</h3>
            <span className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-rose-50/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all animate-in zoom-in-95 duration-200 ${
                msg.senderId === 'me'
                  ? 'bg-rose-400 text-white rounded-tr-none'
                  : 'bg-white text-rose-900 rounded-tl-none border border-rose-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isOutOfRange && (
          <div className="flex justify-center p-4">
            <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl flex items-center gap-2 text-rose-400 text-xs font-bold animate-pulse">
              <AlertCircle size={14} />
              You are moving out of range
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-rose-50">
        <div className="flex items-center gap-2 bg-rose-50/50 p-2 rounded-2xl border-2 border-transparent focus-within:border-rose-100 transition-all">
          <button className="p-2 text-rose-300 hover:text-rose-500">
            <Smile size={24} />
          </button>
          <input
            type="text"
            placeholder="Lovely to meet you..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent outline-none text-rose-900 placeholder:text-rose-300 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-rose-400 text-white rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-500 disabled:opacity-50 transition-all active:scale-90"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
