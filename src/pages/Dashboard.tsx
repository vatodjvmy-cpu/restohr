import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Calendar, Users, AlertTriangle, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import { storage } from '../utils/storage';
import { BranchId } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [selectedBranch, setSelectedBranch] = useState<BranchId | 'all'>('all');
  const navigate = useNavigate();
  const state = storage.getState();
  const user = storage.getCurrentUser()!;
  
  const branches = user.role === 'owner' ? state.branches : state.branches.filter(b => b.id === user.branchId || b.managerIds.includes(user.id));
  
  const stats = {
    activeStaff: state.users.filter(u => u.role === 'staff').length,
    pendingMessages: state.messages.filter(m => !m.flagged).length,
    alerts: state.messages.filter(m => m.flagged).length,
    rotaCompliance: 98,
  };

  return (
    <Layout title={user.role === 'owner' ? 'Owner Dashboard' : 'Branch Dashboard'}>
      <div className="space-y-4">
        {/* Branch Selector (Owner only) */}
        {user.role === 'owner' && (
          <div className="glass-card">
            <label className="block text-xs text-slate-400 mb-2">Select Branch</label>
            <div className="relative">
              <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value as any)} className="input-glass appearance-none pr-10">
                <option value="all">All Branches</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Active Staff', value: stats.activeStaff, icon: <Users size={20} className="text-cyan-400" />, color: 'text-cyan-400' },
            { label: 'Pending Messages', value: stats.pendingMessages, icon: <MessageSquare size={20} className="text-blue-400" />, color: 'text-blue-400' },
            { label: 'Alerts', value: stats.alerts, icon: <AlertTriangle size={20} className="text-red-400" />, color: stats.alerts > 0 ? 'text-red-400' : 'text-slate-400' },
            { label: 'Rota Compliance', value: `${stats.rotaCompliance}%`, icon: <Calendar size={20} className="text-purple-400" />, color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="glass-card text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="flex items-center justify-center gap-1 mt-1 text-slate-400 text-xs">
                {stat.icon}
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Branch Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {(selectedBranch === 'all' ? branches : branches.filter(b => b.id === selectedBranch)).map(branch => {
            const branchMsgs = state.messages.filter(m => m.branchId === branch.id || (m.groupId === 'main-managers' && branch.mainManagerIds.includes(user.id)));
            const branchAlerts = branchMsgs.filter(m => m.flagged).length;
            
            return (
              <motion.div key={branch.id} whileHover={{ scale: 1.01 }} className="glass-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-200">{branch.name}</h3>
                    <p className="text-xs text-slate-500">{branch.location}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-300 border border-slate-700/50">
                    {state.users.filter(u => u.branchId === branch.id).length} staff
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span>💬 {branchMsgs.length} msgs</span>
                  <span className={branchAlerts > 0 ? 'text-red-400' : ''}>⚠️ {branchAlerts} alerts</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/chat')} className="btn-glow text-xs py-1.5">💬 Chat</motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/rota')} className="btn-glow-blue text-xs py-1.5">📅 Rota</motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/staff')} className="btn-glow-purple text-xs py-1.5">👥 Staff</motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="glass-card">
          <h3 className="font-semibold text-sm mb-3 text-slate-200">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/chat')} className="btn-glow flex items-center justify-center gap-1.5 text-xs py-2">
              <MessageSquare size={14} /> Broadcast
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/rota')} className="btn-glow-blue flex items-center justify-center gap-1.5 text-xs py-2">
              <Calendar size={14} /> Edit Rota
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => alert('Export to payroll CSV')} className="btn-glow-purple flex items-center justify-center gap-1.5 text-xs py-2">
              <Users size={14} /> Export Data
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => window.location.href = `mailto:john@lifegrandcafe.com,jeanel@lifegrandcafe.com?subject=RestoHR Weekly Report`} className="btn-glow-red flex items-center justify-center gap-1.5 text-xs py-2">
              <AlertTriangle size={14} /> Email Report
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
}