import type { RiskLevel, PermissionType } from './permission';

export interface FilterState {
    searchQuery: string;
    riskLevel: RiskLevel | null;
    permissionType: PermissionType | null;
}

export interface UIState {
    isLoading: boolean;
    selectedPermissions: Set<string>;
    filters: FilterState;
}

export interface DashboardStats {
    totalPermissions: number;
    safeCount: number;
    moderateCount: number;
    dangerousCount: number;
    recentActivityCount: number;
    overallRiskScore: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'loading';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}
