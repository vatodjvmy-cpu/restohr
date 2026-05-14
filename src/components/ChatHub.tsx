import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, AlertTriangle, Mail, Flag, MessageSquare } from 'lucide-react';
import { storage } from '../utils/storage';
import { BranchId, Role } from '../types';
import { format } from 'date-fns';

interface ChatHubProps {
  branchId: BranchId | 'all';
  groupId: 'owners' | 'main-managers' | 'managers' | 'staff';
  userRole: Role;
}

export default function ChatHub({ branchId, groupId, userRole }: ChatHubProps) {
  const [messages, setMessages] = useState(storage.getState().messages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = storage.getCurrentUser()!;

  useEffect(() => {
    const handleStorage = () => setMessages(storage.getState().messages);
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 2000);
    return () => { window.removeEventListener('storage', handleStorage); clearInterval(interval); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredMessages = messages.filter(m => {
    if (groupId === 'owners') return m.groupId === 'owners' && currentUser.role === 'owner';
    if (groupId === 'main-managers') return m.groupId === 'main-managers' && (currentUser.role === 'owner' || currentUser.role === 'main_manager');
    if (groupId === 'managers') return m.groupId === 'managers' && (currentUser.role === 'owner' || currentUser.role === 'main_manager' || currentUser.role === 'manager');
    return m.groupId === 'staff' && (branchId === 'all' || m.branchId === branchId || m.branchId === 'cross-branch' || currentUser.role === 'owner');
  });

  const handleSend = () => {
    if (!input.trim()) return;
    storage.addMessage({
      branchId: currentUser.branchId === 'all' ? 'cross-branch' : currentUser.branchId as BranchId,
      groupId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: input,
    });
    setInput('');
  };

  const handleFlag = (msgId: string) => {
    alert(`Issue flagged. HR & Owners have been notified.`);
  };

  const handleEmailHR = () => {
    const subject = encodeURIComponent('RestoHR: Employee Issue Report');
    const body = encodeURIComponent(`From: ${currentUser.name}\nBranch: ${branchId}\nGroup: ${groupId}\n\nPlease describe your issue here:`);
    window.location.href = `mailto:john@lifegrandcafe.com,jeanel@lifegrandcafe.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="glass-card h-[calc(100vh-220px)] md:h-[calc(100vh-180px)] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-50" />
            <p>No messages in this group yet</p>
            <p className="text-xs mt-1">Start the conversation below</p>
          </div>
        ) : (
          filteredMessages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-xl border ${msg.flagged ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/50 border-slate-700/50'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-cyan-400">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-500">{format(new Date(msg.timestamp), 'HH:mm • MMM d')}</span>
                    {msg.flagged && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                        <AlertTriangle size={10} /> {msg.flaggedReason}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">{msg.content}</p>
                  {msg.imageUrl && <img src={msg.imageUrl} alt="Attachment" className="mt-2 rounded-lg max-h-40 object-cover" />}
                </div>
                {(userRole === 'owner' || userRole === 'main_manager') && (
                  <div className="flex flex-col gap-1">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleFlag(msg.id)} className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Flag to HR">
                      <Flag size={14} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={handleEmailHR} className="p-1.5 rounded-lg bg-slate-700/50 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors" title="Email HR">
                      <Mail size={14} />
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type message..."
            className="flex-1 input-glass"
          />
          <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-400 transition-colors">
            <ImageIcon size={18} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend} disabled={!input.trim()} className="btn-glow flex items-center gap-1.5">
            <Send size={16} />
            <span className="hidden sm:inline">Send</span>
          </motion.button>
        </div>
        {userRole === 'staff' && (
          <div className="flex gap-2 mt-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => alert('Leave request form would open')} className="flex-1 btn-glow-blue text-xs py-1.5">📅 Request Leave</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleEmailHR} className="flex-1 btn-glow-purple text-xs py-1.5">📧 Email HR</motion.button>
          </div>
        )}
      </div>
    </div>
  );
}