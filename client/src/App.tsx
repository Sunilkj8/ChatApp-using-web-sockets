import { useEffect, useState } from 'react';
import { socket } from './lib/socket';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { MessageSquare, LogIn, Loader2 } from 'lucide-react';

export interface User {
  id: string;
  username: string;
  room?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

function App() {
  // connection status can be added later
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>('General');
  const [activePrivateChat, setActivePrivateChat] = useState<User | null>(null);
  
  const [roomMessages, setRoomMessages] = useState<Record<string, Message[]>>({ 'General': [] });
  const [privateMessages, setPrivateMessages] = useState<Record<string, Message[]>>({}); // Indexed by other user's ID

  useEffect(() => {
    socket.on('connect', () => {
      // setIsConnected(true);
    });

    socket.on('disconnect', () => {
      // setIsConnected(false);
      setIsRegistered(false);
    });

    socket.on('users', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on('room_message', (msg: Message) => {
      setRoomMessages(prev => {
        const currentRoom = activeRoom; // Ideally we track which room it belongs to, but server sends to current room
        return {
          ...prev,
          [currentRoom]: [...(prev[currentRoom] || []), msg]
        };
      });
    });

    socket.on('private_message', (msg: Message) => {
      const isSelf = msg.senderId === socket.id;
      // If we sent it, we need to know who we sent it to to update the correct chat
      // Wait, we need the other user's ID to store it properly.
      // If we are the sender, the server doesn't tell us who it was sent TO in the current structure.
      // Let's modify the server to include the 'to' or we can handle it in the component.
      // Actually, if we sent it, we don't need the server to send it back, we can just append it locally.
      // Let's assume we handle it locally for now.
      if (!isSelf) {
        setPrivateMessages(prev => ({
          ...prev,
          [msg.senderId]: [...(prev[msg.senderId] || []), msg]
        }));
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('users');
      socket.off('room_message');
      socket.off('private_message');
    };
  }, [activeRoom]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && !isConnecting) {
      setIsConnecting(true);
      socket.connect();
      
      const onConnect = () => {
        socket.emit('register', username.trim());
        socket.emit('join_room', 'General');
        setIsRegistered(true);
        setIsConnecting(false);
        socket.off('connect_error', onConnectError);
      };
      
      const onConnectError = () => {
        setIsConnecting(false);
        alert('Failed to connect to the server. Please try again later.');
        socket.off('connect', onConnect);
        socket.disconnect();
      };
      
      socket.once('connect', onConnect);
      socket.once('connect_error', onConnectError);
    }
  };

  const handleJoinRoom = (room: string) => {
    setActivePrivateChat(null);
    setActiveRoom(room);
    setIsSidebarOpen(false);
    socket.emit('join_room', room);
  };

  const handleStartPrivateChat = (user: User) => {
    setActiveRoom('');
    setActivePrivateChat(user);
    setIsSidebarOpen(false);
  };

  const handleSendRoomMessage = (content: string) => {
    socket.emit('send_room_message', { room: activeRoom, content });
  };

  const handleSendPrivateMessage = (content: string) => {
    if (activePrivateChat) {
      socket.emit('send_private_message', { to: activePrivateChat.id, content });
      // Optimistically add message
      const newMsg: Message = {
        id: Date.now().toString(),
        senderId: socket.id as string,
        senderName: username,
        content,
        timestamp: new Date().toISOString()
      };
      setPrivateMessages(prev => ({
        ...prev,
        [activePrivateChat.id]: [...(prev[activePrivateChat.id] || []), newMsg]
      }));
    }
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-400">
        <div className="absolute inset-0 bg-dark-400/80 backdrop-blur-sm"></div>
        <div className="relative z-10 glass-panel p-8 rounded-2xl w-full max-w-md">
          <div className="flex items-center justify-center mb-8 text-white">
            <MessageSquare size={48} />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-white">Welcome to Sniz</h1>
          <p className="text-gray-400 text-center mb-8">Enter a username to join the conversation.</p>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username..."
                className="w-full px-4 py-3 rounded-lg glass-input text-lg"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!username.trim() || isConnecting}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <>
                  <span>Connecting...</span>
                  <Loader2 size={20} className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Join Chat</span>
                  <LogIn size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
      <div className="flex h-screen bg-dark-400 overflow-hidden relative">
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <Sidebar 
          users={users} 
          currentUserId={socket.id as string}
          activeRoom={activeRoom}
          activePrivateChatId={activePrivateChat?.id}
          onJoinRoom={handleJoinRoom}
          onStartPrivateChat={handleStartPrivateChat}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 flex flex-col min-w-0 bg-dark-300 relative w-full">
          <ChatArea 
            activeRoom={activeRoom}
            activePrivateChat={activePrivateChat}
            messages={activeRoom ? (roomMessages[activeRoom] || []) : (activePrivateChat ? (privateMessages[activePrivateChat.id] || []) : [])}
            onSendMessage={activeRoom ? handleSendRoomMessage : handleSendPrivateMessage}
            currentUserId={socket.id as string}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
      </main>
    </div>
  );
}

export default App;
