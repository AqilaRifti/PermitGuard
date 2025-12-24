import type { Permission, RiskLevel, PermissionType, FilterState } from '@/types';

/**
 * Filters permissions by search query (matches dApp name case-insensitively).
 */
export function filterBySearch(permissions: Permission[], query: string): Permission[] {
    if (!query.trim()) {
        return permissions;
    }
    const lowerQuery = query.toLowerCase().trim();
    return permissions.filter(p =>
        p.dAppName.toLowerCase().includes(lowerQuery) ||
        p.dAppUrl.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Filters permissions by risk level.
 */
export function filterByRiskLevel(permissions: Permission[], riskLevel: RiskLevel | null): Permission[] {
    if (riskLevel === null) {
        return permissions;
    }
    return permissions.filter(p => p.riskLevel === riskLevel);
}

/**
 * Filters permissions by permission type.
 */
export function filterByPermissionType(permissions: Permission[], permissionType: PermissionType | null): Permission[] {
    if (permissionType === null) {
        return permissions;
    }
    return permissions.filter(p => p.permissionType === permissionType);
}

/**
 * Applies all filters to permissions.
 */
export function applyFilters(permissions: Permission[], filters: FilterState): Permission[] {
    let result = permissions;

    result = filterBySearch(result, filters.searchQuery);
    result = filterByRiskLevel(result, filters.riskLevel);
    result = filterByPermissionType(result, filters.permissionType);

    return result;
}

/**
 * Creates an empty filter state.
 */
export function createEmptyFilterState(): FilterState {
    return {
        searchQuery: '',
        riskLevel: null,
        permissionType: null,
    };
}

/**
 * Checks if any filters are active.
 */
export function hasActiveFilters(filters: FilterState): boolean {
    return (
        filters.searchQuery.trim() !== '' ||
        filters.riskLevel !== null ||
        filters.permissionType !== null
    );
}
