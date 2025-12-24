import { WalletProvider, useWallet } from '@/context/WalletContext';
import { usePermissions, useHistory, useStats, useToasts } from '@/hooks';
import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { StatsBar } from '@/components/StatsBar';
import { PermissionsDashboard } from '@/components/PermissionsDashboard';
import { HistoryTimeline } from '@/components/HistoryTimeline';
import { ToastContainer } from '@/components/Toast';
import './index.css';

function Dashboard() {
  const { isConnected } = useWallet();
  const {
    permissions,
    isLoading: permissionsLoading,
    revokePermission,
    revokePermissions,
    revokingIds,
  } = usePermissions();
  const { events, isLoading: historyLoading, error: historyError } = useHistory();
  const { stats } = useStats(permissions, events);
  const toasts = useToasts();

  return (
    <Layout>
      <HeroSection />

      {isConnected && (
        <>
          <StatsBar stats={stats} isLoading={permissionsLoading} />

          <PermissionsDashboard
            permissions={permissions}
            isLoading={permissionsLoading}
            revokingIds={revokingIds}
            onRevoke={revokePermission}
            onBulkRevoke={revokePermissions}
          />

          <HistoryTimeline
            events={events}
            isLoading={historyLoading}
            error={historyError}
          />
        </>
      )}

      <ToastContainer toasts={toasts} />
    </Layout>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <Dashboard />
    </WalletProvider>
  );
}
