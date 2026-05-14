import Layout from '../components/Layout';
import RotaView from '../components/RotaView';
import { storage } from '../utils/storage';

export default function RotaPage() {
  const user = storage.getCurrentUser()!;
  const branchId = user.role === 'owner' ? 'va-waterfront' : (user.branchId as any);
  
  return (
    <Layout title="Rota & Scheduling">
      <RotaView branchId={branchId} userRole={user.role} />
    </Layout>
  );
}