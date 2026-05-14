import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react';
import { storage } from '../utils/storage';
import { BranchId, Role } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, isSameDay } from 'date-fns';

interface RotaViewProps {
  branchId: BranchId;
  userRole: Role;
}

export default function RotaView({ branchId, userRole }: RotaViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const shifts = storage.getShiftsForBranch(branchId, weekStart, weekEnd);
  const groupedShifts: Record<string, typeof shifts> = {};
  
  days.forEach(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    groupedShifts[dateStr] = shifts.filter(s => s.date === dateStr);
  });

  const shiftColors: Record<string, string> = {
    breakfast: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    lunch: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    dinner: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    closing: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  };

  return (
    <div className="space-y-4">
      {/* Week Navigator */}
      <div className="glass-card flex items-center justify-between">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))} className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-colors">
          <ChevronLeft size={18} />
        </motion.button>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-200">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </p>
          <p className="text-xs text-slate-500">Weekly Rota</p>
        </div>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentWeek(new Date())} className="btn-glow text-xs py-1.5">Today</motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))} className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-colors">
            <ChevronRight size={18} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-colors">
            <Download size={18} />
          </motion.button>
        </div>
      </div>

      {/* Rota Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayShifts = groupedShifts[dateStr] || [];
          const isToday = isSameDay(day, new Date());
          
          return (
            <motion.div key={dateStr} whileHover={{ scale: 1.02 }} className={`glass-card ${isToday ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : ''}`}>
              <div className="text-center mb-2">
                <p className={`text-xs font-medium ${isToday ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {format(day, 'EEE')}
                </p>
                <p className={`text-lg font-bold ${isToday ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {format(day, 'd')}
                </p>
              </div>
              
              <div className="space-y-2">
                {dayShifts.length === 0 ? (
                  <p className="text-[10px] text-slate-600 text-center py-2">No shifts</p>
                ) : (
                  dayShifts.map(shift => (
                    <div key={shift.id} className={`p-2 rounded-lg border text-xs ${shiftColors[shift.type] || shiftColors.breakfast}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium capitalize">{shift.type}</span>
                        <span className="opacity-70">{shift.startTime}-{shift.endTime}</span>
                      </div>
                      <p className="truncate">{shift.userName}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {(userRole === 'manager' || userRole === 'main_manager' || userRole === 'owner') && (
        <div className="flex gap-3 mt-4">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => alert('Upload monthly rota PDF')} className="flex-1 btn-glow flex items-center justify-center gap-2">
            <Calendar size={16} /> Upload Monthly Rota
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => alert('Edit shifts mode')} className="flex-1 btn-glow-blue flex items-center justify-center gap-2">
            <Calendar size={16} /> Edit Shifts
          </motion.button>
        </div>
      )}
    </div>
  );
}