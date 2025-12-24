import { useState, useEffect, useCallback } from 'react';
import type { Permission } from '@/types';
import { metamaskService, toastService } from '@/services';
import { useWallet } from '@/context/WalletContext';

interface UsePermissionsReturn {
    permissions: Permission[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    revokePermission: (id: string) => Promise<boolean>;
    revokePermissions: (ids: string[]) => Promise<{ success: number; failed: number }>;
    revokingIds: Set<string>;
}

export function usePermissions(): UsePermissionsReturn {
    const { isConnected, address } = useWallet();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [revokingIds, setRevokingIds] = useState<Set<string>>(new Set());

    const fetchPermissions = useCallback(async () => {
        if (!isConnected || !address) {
            setPermissions([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await metamaskService.getPermissions();
            setPermissions(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch permissions';
            setError(message);
            toastService.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [isConnected, address]);

    const revokePermission = useCallback(async (id: string): Promise<boolean> => {
        setRevokingIds(prev => new Set(prev).add(id));

        try {
            await metamaskService.revokePermission(id);
            setPermissions(prev => prev.filter(p => p.id !== id));
            toastService.success('Permission revoked successfully');
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to revoke permission';
            toastService.error(message);
            return false;
        } finally {
            setRevokingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    }, []);

    const revokePermissions = useCallback(async (ids: string[]): Promise<{ success: number; failed: number }> => {
        const results = { success: 0, failed: 0 };

        setRevokingIds(new Set(ids));

        for (const id of ids) {
            try {
                await metamaskService.revokePermission(id);
                setPermissions(prev => prev.filter(p => p.id !== id));
                results.success++;
            } catch {
                results.failed++;
            }
        }

        setRevokingIds(new Set());

        if (results.failed === 0) {
            toastService.success(`Successfully revoked ${results.success} permission(s)`);
        } else {
            toastService.warning(`Revoked ${results.success}, failed ${results.failed}`);
        }

        return results;
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    return {
        permissions,
        isLoading,
        error,
        refetch: fetchPermissions,
        revokePermission,
        revokePermissions,
        revokingIds,
    };
}
