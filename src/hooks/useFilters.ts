import { useState, useCallback, useEffect } from 'react';
import type { FilterState, RiskLevel, PermissionType } from '@/types';
import { createEmptyFilterState, hasActiveFilters } from '@/utils/filter';

const STORAGE_KEY = 'metamask-dashboard-filters';

interface UseFiltersReturn {
    filters: FilterState;
    setSearchQuery: (query: string) => void;
    setRiskLevel: (level: RiskLevel | null) => void;
    setPermissionType: (type: PermissionType | null) => void;
    clearFilters: () => void;
    hasFilters: boolean;
}

export function useFilters(): UseFiltersReturn {
    const [filters, setFilters] = useState<FilterState>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch {
            // Ignore parse errors
        }
        return createEmptyFilterState();
    });

    // Persist filters to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }, [filters]);

    const setSearchQuery = useCallback((query: string) => {
        setFilters(prev => ({ ...prev, searchQuery: query }));
    }, []);

    const setRiskLevel = useCallback((level: RiskLevel | null) => {
        setFilters(prev => ({ ...prev, riskLevel: level }));
    }, []);

    const setPermissionType = useCallback((type: PermissionType | null) => {
        setFilters(prev => ({ ...prev, permissionType: type }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(createEmptyFilterState());
    }, []);

    return {
        filters,
        setSearchQuery,
        setRiskLevel,
        setPermissionType,
        clearFilters,
        hasFilters: hasActiveFilters(filters),
    };
}
