import { motion } from 'framer-motion';
import { Trophy, Heart, Star, Calendar } from 'lucide-react';
import Layout from '../components/Layout';
import { storage } from '../utils/storage';
import { format } from 'date-fns';

export default function AwardsPage() {
  const state = storage.getState();
  const awards = state.awards || [];
  const birthdays = state.birthdays || [];
  
  return (
    <Layout title="Awards & Birthdays">
      <div className="space-y-6">
        {/* Company Awards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 border-l-4 border-yellow-500/50">
          <h3 className="font-semibold text-lg text-slate-200 flex items-center gap-2 mb-4">
            <Trophy size={20} className="text-yellow-400" />
            Company Achievements
          </h3>
          <div className="space-y-3">
            {awards.filter(a => a.branchId === 'company').length === 0 ? (
              <p className="text-sm text-slate-500 italic">No company awards recorded yet.</p>
            ) : (
              awards.filter(a => a.branchId === 'company').map(award => (
                <div key={award.id} className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-medium text-slate-200 text-base">{award.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{award.description}</p>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{format(new Date(award.date), 'MMM yyyy')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Employee of the Month */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <h3 className="font-semibold text-lg text-slate-200 flex items-center gap-2 mb-4">
            <Star size={20} className="text-cyan-400" />
            Employee of the Month
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {awards.filter(a => a.branchId !== 'company').length === 0 ? (
              <p className="text-sm text-slate-500 italic col-span-2">No employee awards recorded yet.</p>
            ) : (
              awards.filter(a => a.branchId !== 'company').map(award => (
                <div key={award.id} className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg flex-shrink-0">
                    {award.recipient?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-200 truncate">{award.recipient}</p>
                    <p className="text-xs text-slate-400">{award.branchId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Branch</p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{award.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Birthdays */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <h3 className="font-semibold text-lg text-slate-200 flex items-center gap-2 mb-4">
            <Heart size={20} className="text-pink-400" />
            Upcoming Birthdays
          </h3>
          {birthdays.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No birthdays recorded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {birthdays.map(bday => (
                <div key={bday.id} className="p-3 rounded-xl bg-pink-500/5 border border-pink-500/20 text-center">
                  <p className="font-medium text-slate-200 text-sm truncate">{bday.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-pink-400">
                    <Calendar size={12} />
                    <span className="text-xs font-medium">{bday.date.replace('-', ' / ')}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 truncate">{bday.branchId.replace('-', ' ')}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}