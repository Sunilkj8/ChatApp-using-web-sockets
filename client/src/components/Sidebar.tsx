import { Hash, Users, Circle } from 'lucide-react';
import type { User } from '../App';
import { cn } from '../lib/utils';

interface SidebarProps {
  users: User[];
  currentUserId: string;
  activeRoom: string;
  activePrivateChatId?: string;
  onJoinRoom: (room: string) => void;
  onStartPrivateChat: (user: User) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ROOMS = ['General', 'Gaming', 'Technology', 'Random'];

export function Sidebar({ users, currentUserId, activeRoom, activePrivateChatId, onJoinRoom, onStartPrivateChat, isOpen, onClose }: SidebarProps) {
  const otherUsers = users.filter(u => u.id !== currentUserId);

  return (
    <aside className={cn(
      "w-72 glass-panel flex flex-col h-full border-r border-dark-200/50 z-40 absolute md:relative inset-y-0 left-0 transform transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <div className="p-6 border-b border-dark-200/50 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
          Sniz
        </h2>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
        <div className="mb-8">
          <div className="px-6 flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            <Hash size={14} className="mr-2" />
            Rooms
          </div>
          <div className="space-y-1 px-3">
            {ROOMS.map(room => (
              <button
                key={room}
                onClick={() => onJoinRoom(room)}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 group text-left",
                  activeRoom === room 
                    ? "bg-white/10 text-white font-medium" 
                    : "text-gray-400 hover:bg-dark-200/50 hover:text-gray-200"
                )}
              >
                <Hash size={16} className={cn("mr-3", activeRoom === room ? "text-white" : "text-gray-500 group-hover:text-gray-400")} />
                {room}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="px-6 flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            <Users size={14} className="mr-2" />
            Direct Messages
          </div>
          <div className="space-y-1 px-3">
            {otherUsers.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-600 italic">No other users online.</p>
            ) : (
              otherUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => onStartPrivateChat(user)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-left",
                    activePrivateChatId === user.id
                      ? "bg-white/10 text-white font-medium"
                      : "text-gray-400 hover:bg-dark-200/50 hover:text-gray-200"
                  )}
                >
                  <div className="relative mr-3 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-dark-100 flex items-center justify-center text-sm font-semibold uppercase text-gray-300 border border-dark-200">
                      {user.username.charAt(0)}
                    </div>
                    <Circle size={10} className="absolute bottom-0 right-0 text-green-500 fill-current border border-dark-300 rounded-full" />
                  </div>
                  <span className="truncate">{user.username}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-dark-200/50 bg-dark-300/30">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold uppercase border border-white/20 mr-3">
            {users.find(u => u.id === currentUserId)?.username.charAt(0) || '?'}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-200">{users.find(u => u.id === currentUserId)?.username || 'User'}</div>
            <div className="text-xs text-green-400 flex items-center">
              <Circle size={8} className="mr-1 fill-current" /> Online
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
