import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, AlertTriangle, Plus, BookOpen, Award, Heart, Shield } from 'lucide-react';
import Layout from '../components/Layout';
import LeaveRequest from '../components/LeaveRequest';
import { storage } from '../utils/storage';
import { BranchId } from '../types';
import { useNavigate } from 'react-router-dom';

export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const navigate = useNavigate();
  const user = storage.getCurrentUser()!;
  const state = storage.getState();
  
  const staff = state.users.filter(u => 
    (user.role === 'owner' || u.branchId === user.branchId || state.branches.find(b => b.id === user.branchId)?.managerIds.includes(user.id)) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout title="Staff Directory">
      <div className="space-y-4">
        <div className="glass-card flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search staff..." className="input-glass pl-10" />
          </div>
          {user.role !== 'owner' && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowLeaveModal(true)} className="btn-glow flex items-center gap-1.5">
              <Plus size={16} /> Leave
            </motion.button>
          )}
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Menu', icon: <BookOpen size={18} />, path: '/menu', color: 'text-purple-400' },
            { label: 'Awards', icon: <Award size={18} />, path: '/awards', color: 'text-yellow-400' },
            { label: 'Birthdays', icon: <Heart size={18} />, path: '/awards', color: 'text-pink-400' },
            { label: 'Hygiene', icon: <Shield size={18} />, path: '/hygiene', color: 'text-green-400' },
          ].map(item => (
            <motion.button key={item.label} whileTap={{ scale: 0.95 }} onClick={() => navigate(item.path)} className="glass-card flex flex-col items-center gap-2 py-4 hover:bg-slate-800/80 transition-colors">
              <div className={item.color}>{item.icon}</div>
              <span className="text-xs font-medium text-slate-300">{item.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map(member => {
            const leaveRequests = state.leaveRequests.filter(r => r.userId === member.id && r.status === 'pending');
            const branch = state.branches.find(b => b.id === member.branchId);
            
            return (
              <motion.div key={member.id} whileHover={{ scale: 1.02 }} className="glass-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-200">{member.name}</h3>
                    <p className="text-xs text-slate-400 capitalize">{member.role.replace('_', ' ')}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{branch?.name}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${member.role === 'owner' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}`}>
                    {member.role}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => window.location.href = `mailto:${member.email}`} className="flex-1 btn-glow text-xs py-1.5 flex items-center justify-center gap-1">
                    <Mail size={12} /> Email
                  </motion.button>
                  {leaveRequests.length > 0 && (
                    <motion.button whileTap={{ scale: 0.95 }} className="flex-1 btn-glow-red text-xs py-1.5 flex items-center justify-center gap-1">
                      <AlertTriangle size={12} /> {leaveRequests.length} Pending
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {showLeaveModal && <LeaveRequest branchId={user.branchId as BranchId} onClose={() => setShowLeaveModal(false)} />}
        </AnimatePresence>
      </div>
    </Layout>
  );
}