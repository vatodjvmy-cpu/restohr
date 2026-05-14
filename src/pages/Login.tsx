import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = storage.login(email);
    if (user) {
      navigate('/dashboard');
    } else {
      setError('Email not found. Use demo accounts below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">RestoHR</h1>
          <p className="text-slate-400 text-sm mt-1">Life Grand Cafe</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input-glass" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-glass" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <motion.button whileTap={{ scale: 0.95 }} onClick={handleLogin} className="w-full btn-glow flex items-center justify-center gap-2 py-3">
            <LogIn size={18} /> Login
          </motion.button>

          <div className="text-center">
            <p className="text-xs text-slate-500">Demo accounts (any password):</p>
            <div className="mt-2 space-y-1 text-[10px] text-slate-600">
              <p>john@lifegrandcafe.com (Owner)</p>
              <p>thandi@va.com (Main Manager)</p>
              <p>sarah@va.com (Manager)</p>
              <p>lisa@wf.com (Staff)</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}