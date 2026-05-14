import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import ChatHub from '../components/ChatHub';
import { storage } from '../utils/storage';
import { BranchId } from '../types';

export default function ChatPage() {
  const [branchId, setBranchId] = useState<BranchId | 'all'>('all');
  const [groupId, setGroupId] = useState<'owners' | 'main-managers' | 'managers' | 'staff'>('staff');
  const user = storage.getCurrentUser()!;
  
  const availableGroups = user.role === 'owner' 
    ? ['owners', 'main-managers', 'managers', 'staff'] as const
    : user.role === 'main_manager'
    ? ['main-managers', 'managers', 'staff'] as const
    : user.role === 'manager'
    ? ['managers', 'staff'] as const
    : ['staff'] as const;

  const branches = user.role === 'owner' ? storage.getState().branches : storage.getState().branches.filter(b => b.id === user.branchId || b.managerIds.includes(user.id));

  return (
    <Layout title="Communication Hub">
      <div className="space-y-4">
        <div className="glass-card flex flex-wrap gap-3">
          {user.role === 'owner' && (
            <div className="relative flex-1 min-w-[150px]">
              <select value={branchId} onChange={(e) => setBranchId(e.target.value as any)} className="input-glass appearance-none pr-8">
                <option value="all">All Branches</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          )}
          <div className="relative flex-1 min-w-[150px]">
            <select value={groupId} onChange={(e) => setGroupId(e.target.value as any)} className="input-glass appearance-none pr-8">
              {availableGroups.map(g => <option key={g} value={g}>{g.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <ChatHub branchId={branchId} groupId={groupId} userRole={user.role} />
      </div>
    </Layout>
  );
}