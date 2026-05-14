import { motion } from 'framer-motion';
import { Coffee, Sun, Moon, Info, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { storage } from '../utils/storage';

export default function MenuPage() {
  const menu = storage.getState().menu || [];
  const icons = [Coffee, Sun, Moon];
  
  return (
    <Layout title="Restaurant Menu">
      <div className="space-y-6">
        <div className="glass-card flex items-start gap-3 text-sm text-slate-400 p-4">
          <Info size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
          <p>Full menu for training & reference. All prices include VAT. Dietary options available upon request. New staff: familiarize yourself with ingredients & allergens.</p>
        </div>
        
        {menu.length === 0 ? (
          <div className="glass-card text-center py-12 text-slate-500">
            <AlertCircle size={40} className="mx-auto mb-3 opacity-50" />
            <p>Menu data not loaded yet</p>
          </div>
        ) : (
          menu.map((cat, i) => {
            const Icon = icons[i] || Coffee;
            return (
              <motion.div key={cat.category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                <h3 className="font-semibold text-lg text-slate-200 flex items-center gap-2 mb-4">
                  <Icon size={20} className="text-purple-400" />
                  {cat.category}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {cat.items.map(item => (
                    <div key={item.name} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-slate-200 text-base">{item.name}</span>
                        <span className="text-cyan-400 font-bold text-lg">{item.price}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3 leading-relaxed">{item.description}</p>
                      {item.dietary && (
                        <span className="text-[11px] px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-medium">
                          {item.dietary}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </Layout>
  );
}