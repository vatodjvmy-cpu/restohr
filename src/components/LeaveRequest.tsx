import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Send, X } from 'lucide-react';
import { storage } from '../utils/storage';
import { BranchId } from '../types';

interface LeaveRequestProps {
  branchId: BranchId;
  onClose: () => void;
}

export default function LeaveRequest({ branchId, onClose }: LeaveRequestProps) {
  const [type, setType] = useState<'annual' | 'sick' | 'family' | 'unpaid'>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const user = storage.getCurrentUser()!;

  const handleSubmit = () => {
    if (!startDate || !endDate) return;
    storage.addLeaveRequest({
      userId: user.id,
      userName: user.name,
      branchId,
      type,
      startDate,
      endDate,
      reason,
    });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-slate-200">Request Leave</h3>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onClose} className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400">
            <X size={18} />
          </motion.button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Leave Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="input-glass">
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="family">Family Responsibility</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-glass" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-glass" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">Reason (Optional)</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="input-glass min-h-[80px]" placeholder="Family commitment, medical appointment, etc." />
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Calendar size={16} className="text-cyan-400" />
            <p className="text-xs text-slate-300">Manager & HR will be notified via email upon submission.</p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={onClose} className="flex-1 btn-glow">Cancel</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={!startDate || !endDate} className="flex-1 btn-glow-blue flex items-center justify-center gap-1.5">
              <Send size={14} /> Submit Request
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}