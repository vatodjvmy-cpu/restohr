import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, Settings, LogOut, MessageSquare, Calendar, Users, Home, BookOpen, Award, Heart, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { storage } from '../utils/storage';
import TopBanner from './TopBanner';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = storage.getCurrentUser()!;
  
  const navItems = [
    { id: '/dashboard', label: 'Home', icon: <Home size={18} /> },
    { id: '/chat', label: 'Chat', icon: <MessageSquare size={18} /> },
    { id: '/rota', label: 'Rota', icon: <Calendar size={18} /> },
    { id: '/staff', label: 'Staff', icon: <Users size={18} /> },
    { id: '/menu', label: 'Menu', icon: <BookOpen size={18} /> },
    { id: '/awards', label: 'Awards', icon: <Award size={18} /> },
    { id: '/hygiene', label: 'Hygiene', icon: <Shield size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </motion.button>
            
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              RestoHR
            </h1>
            <span className="hidden sm:inline text-slate-400 text-xs">{user?.branchId === 'all' ? 'Owner View' : user?.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.95 }} className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-cyan-400 transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-slate-900">3</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-cyan-400 transition-colors">
              <Settings size={18} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <TopBanner />
      </div>

      {/* Mobile Sidebar Drawer (Overlay) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-700/50 z-50 md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h2 className="font-bold text-slate-200">Menu</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400">
                  <X size={18} />
                </motion.button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map(item => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { navigate(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.id) 
                        ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-500/30' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-700/50 mt-auto">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { storage.logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex flex-col w-20 lg:w-56 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 fixed left-0 top-[73px] bottom-0 z-30">
        <nav className="flex-1 py-4 px-2 lg:px-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all ${
                isActive(item.id) 
                  ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="hidden lg:inline text-sm font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700/50">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { storage.logout(); navigate('/login'); }} className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={18} />
            <span className="hidden lg:inline text-sm font-medium">Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-4 px-4 pb-24 md:pb-8 md:ml-20 lg:ml-56 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-slate-200">{title}</h2>
          <div className="min-h-[60vh]">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 z-30 safe-bottom">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map(item => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all min-w-[60px] ${
                isActive(item.id) ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  );
}