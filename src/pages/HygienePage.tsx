import { motion } from 'framer-motion';
import { Shield, Droplets, Utensils, AlertCircle, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import { storage } from '../utils/storage';

export default function HygienePage() {
  const hygiene = storage.getState().hygiene || [];
  const icons = [Droplets, Utensils];
  
  return (
    <Layout title="Hygiene & Etiquette">
      <div className="space-y-6">
        <div className="glass-card flex items-start gap-3 text-sm text-slate-400 p-4 border-l-4 border-blue-500/50">
          <AlertCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p><strong>Mandatory reading for all new staff.</strong> Compliance ensures guest safety, brand reputation, and legal compliance. Managers must verify understanding during onboarding.</p>
        </div>
        
        {hygiene.length === 0 ? (
          <div className="glass-card text-center py-12 text-slate-500">
            <Shield size={40} className="mx-auto mb-3 opacity-50" />
            <p>Hygiene guidelines not loaded yet</p>
          </div>
        ) : (
          hygiene.map((cat, i) => {
            const Icon = icons[i] || Shield;
            return (
              <motion.div key={cat.category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                <h3 className="font-semibold text-lg text-slate-200 flex items-center gap-2 mb-4">
                  <Icon size={20} className="text-green-400" />
                  {cat.category}
                </h3>
                <div className="space-y-3">
                  {cat.rules.map(rule => (
                    <div key={rule.title} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-cyan-300 mb-1">{rule.title}</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
        
        <div className="glass-card bg-purple-500/5 border-purple-500/30 text-center p-6">
          <p className="text-sm text-slate-300 italic mb-2">"Cleanliness is next to godliness. Our standards protect our guests and our reputation."</p>
          <p className="text-xs text-purple-400 font-medium">— Life Grand Cafe Operations Manual</p>
        </div>
      </div>
    </Layout>
  );
}