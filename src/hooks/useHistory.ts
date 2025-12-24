import { useState, useEffect, useCallback } from 'react';
import type { PermissionEvent } from '@/types';
import { envioService } from '@/services';
import { useWallet } from '@/context/WalletContext';

interface UseHistoryReturn {
    events: PermissionEvent[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useHistory(): UseHistoryReturn {
    const { isConnected, address } = useWallet();
    const [events, setEvents] = useState<PermissionEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        if (!isConnected || !address) {
            setEvents([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await envioService.getPermissionHistory(address);
            setEvents(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch history';
            setError(message);
            // Don't show toast for history errors - graceful degradation
        } finally {
            setIsLoading(false);
        }
    }, [isConnected, address]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Subscribe to real-time events
    useEffect(() => {
        if (!isConnected || !address) return;

        const unsubscribe = envioService.subscribeToEvents(address, (newEvent) => {
            setEvents(prev => [newEvent, ...prev]);
        });

        return unsubscribe;
    }, [isConnected, address]);

    return {
        events,
        isLoading,
        error,
        refetch: fetchHistory,
    };
}
