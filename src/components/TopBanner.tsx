import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Quote } from 'lucide-react';
import { storage } from '../utils/storage';
import { format } from 'date-fns';

const dailyQuotes = [
  "Excellence is not a skill, it's an attitude.",
  "Hospitality is making people feel welcome and valued.",
  "Great teams don't just work together, they grow together.",
  "Service is the rent we pay for being on this earth.",
  "Every guest is a story waiting to be told with care.",
  "Consistency builds trust, trust builds loyalty.",
  "Pride in your work shows in every detail.",
  "Kindness costs nothing but means everything.",
  "A smooth sea never made a skilled sailor.",
  "Today's effort is tomorrow's reputation."
];

export default function TopBanner() {
  const user = storage.getCurrentUser();
  const [time, setTime] = useState(new Date());
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const dayOfYear = Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(dailyQuotes[dayOfYear % dailyQuotes.length]);
    return () => clearInterval(timer);
  }, [time]);

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 text-cyan-400">
          <Calendar size={16} />
          <span className="text-sm font-medium">{format(time, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-blue-400">
          <Clock size={16} />
          <span className="text-sm font-medium tabular-nums">{format(time, 'HH:mm:ss')}</span>
        </div>
      </div>
      
      <div className="flex-1 text-center w-full md:w-auto">
        <p className="text-xs text-slate-400 italic flex items-center justify-center gap-1">
          <Quote size={12} className="text-purple-400 flex-shrink-0" />
          <span className="line-clamp-1">{quote}</span>
        </p>
      </div>
      
      <div className="text-sm font-medium text-slate-200 w-full md:w-auto text-center md:text-right">
        Welcome back, <span className="text-cyan-300">{user.name}</span> 👋
      </div>
    </motion.div>
  );
}