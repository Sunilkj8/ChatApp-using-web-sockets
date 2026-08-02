import { useEffect, useRef } from 'react';
import type { Message, User } from '../App';
import { MessageInput } from './MessageInput';
import { Hash, User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatAreaProps {
  activeRoom: string;
  activePrivateChat: User | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
  onOpenSidebar: () => void;
}

export function ChatArea({ activeRoom, activePrivateChat, messages, onSendMessage, currentUserId, onOpenSidebar }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const title = activeRoom ? activeRoom : activePrivateChat?.username;
  const isPrivate = !!activePrivateChat;

  return (
    <div className="flex flex-col h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-dark-400/90 backdrop-blur-3xl z-0"></div>
      
      {/* Header */}
      <header className="h-20 px-4 md:px-6 flex items-center border-b border-dark-200/50 bg-dark-300/40 backdrop-blur-md z-10 shrink-0">
        <button 
          className="md:hidden mr-4 p-2 text-gray-400 hover:text-white transition-colors"
          onClick={onOpenSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
        <div className="flex items-center">
          {isPrivate ? (
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white mr-4 border border-white/20">
              <UserIcon size={20} />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-dark-200 flex items-center justify-center text-gray-400 mr-4 border border-dark-100">
              <Hash size={24} />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-gray-400">
              {isPrivate ? 'Direct Message' : 'Public Room'}
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 z-10 scrollbar-hide space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="w-24 h-24 bg-dark-200/50 rounded-full flex items-center justify-center mb-4">
              {isPrivate ? <UserIcon size={40} className="text-gray-600" /> : <Hash size={40} className="text-gray-600" />}
            </div>
            <p className="text-lg font-medium text-gray-400">No messages yet</p>
            <p className="text-sm">Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSelf = msg.senderId === currentUserId;
            const isSystem = msg.senderId === 'system';
            
            if (isSystem) {
              return (
                <div key={msg.id + index} className="flex justify-center my-4">
                  <span className="text-xs bg-dark-200/60 text-gray-400 px-3 py-1 rounded-full border border-dark-100/30">
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div 
                key={msg.id + index} 
                className={cn(
                  "flex max-w-2xl",
                  isSelf ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase",
                  isSelf ? "bg-white/10 text-white border border-white/20 ml-3" : "bg-dark-200 text-gray-300 border border-dark-100 mr-3"
                )}>
                  {msg.senderName.charAt(0)}
                </div>
                
                <div className={cn(
                  "flex flex-col",
                  isSelf ? "items-end" : "items-start"
                )}>
                  <span className="text-xs text-gray-400 mb-1 px-1">
                    {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed",
                    isSelf 
                      ? "bg-white text-black font-medium rounded-tr-sm" 
                      : "glass-panel rounded-tl-sm text-gray-100"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="z-10 mt-auto shrink-0">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
