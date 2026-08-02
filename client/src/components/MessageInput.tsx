import { useState } from 'react';
import { Send, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-dark-300/80 backdrop-blur-md border-t border-dark-200/50">
      <div className="flex items-end gap-3 max-w-5xl mx-auto relative">
        <button 
          type="button"
          className="p-3 text-gray-400 hover:text-gray-200 transition-colors bg-dark-200/50 rounded-xl border border-dark-100/30 shrink-0"
        >
          <Smile size={20} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-dark-200/50 border border-dark-100/30 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all pr-12"
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-3 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center shadow-lg shadow-white/10"
        >
          <Send size={20} className={message.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
        </button>
      </div>
    </form>
  );
}
