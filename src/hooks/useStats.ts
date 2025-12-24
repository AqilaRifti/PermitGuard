import { useMemo } from 'react';
import type { Permission, PermissionEvent, DashboardStats } from '@/types';
import { calculateOverallRiskScore, countByRiskLevel } from '@/utils/risk';

interface UseStatsReturn {
    stats: DashboardStats;
}

export function useStats(permissions: Permission[], events: PermissionEvent[]): UseStatsReturn {
    const stats = useMemo<DashboardStats>(() => {
        const counts = countByRiskLevel(permissions);
        const overallRiskScore = calculateOverallRiskScore(permissions);

        // Count recent activity (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentActivityCount = events.filter(e => e.timestamp >= oneWeekAgo).length;

        return {
            totalPermissions: permissions.length,
            safeCount: counts.safe,
            moderateCount: counts.moderate,
            dangerousCount: counts.dangerous,
            recentActivityCount,
            overallRiskScore,
        };
    }, [permissions, events]);

    return { stats };
}
