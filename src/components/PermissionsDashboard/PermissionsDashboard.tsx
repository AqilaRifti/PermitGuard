import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Permission } from '@/types';
import { applyFilters } from '@/utils/filter';
import { useFilters } from '@/hooks';
import { SearchFilter } from '@/components/SearchFilter';
import { BulkActions } from '@/components/BulkActions';
import { PermissionCard } from '@/components/PermissionCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import './PermissionsDashboard.css';

interface PermissionsDashboardProps {
    permissions: Permission[];
    isLoading: boolean;
    revokingIds: Set<string>;
    onRevoke: (id: string) => Promise<boolean>;
    onBulkRevoke: (ids: string[]) => Promise<{ success: number; failed: number }>;
}

export function PermissionsDashboard({
    permissions,
    isLoading,
    revokingIds,
    onRevoke,
    onBulkRevoke,
}: PermissionsDashboardProps) {
    const {
        filters,
        setSearchQuery,
        setRiskLevel,
        setPermissionType,
        clearFilters,
        hasFilters,
    } = useFilters();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isBulkRevoking, setIsBulkRevoking] = useState(false);

    const filteredPermissions = useMemo(
        () => applyFilters(permissions, filters),
        [permissions, filters]
    );

    const handleSelect = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const handleBulkRevoke = useCallback(async () => {
        setIsBulkRevoking(true);
        await onBulkRevoke(Array.from(selectedIds));
        setSelectedIds(new Set());
        setIsBulkRevoking(false);
    }, [selectedIds, onBulkRevoke]);

    if (isLoading) {
        return (
            <div className="permissions-dashboard">
                <SearchFilter
                    filters={filters}
                    onSearchChange={setSearchQuery}
                    onRiskLevelChange={setRiskLevel}
                    onPermissionTypeChange={setPermissionType}
                    onClear={clearFilters}
                    hasFilters={hasFilters}
                />
                <div className="permissions-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (permissions.length === 0) {
        return (
            <div className="permissions-dashboard">
                <EmptyState variant="no-permissions" />
            </div>
        );
    }

    return (
        <div className="permissions-dashboard">
            <SearchFilter
                filters={filters}
                onSearchChange={setSearchQuery}
                onRiskLevelChange={setRiskLevel}
                onPermissionTypeChange={setPermissionType}
                onClear={clearFilters}
                hasFilters={hasFilters}
            />

            <BulkActions
                selectedCount={selectedIds.size}
                onRevoke={handleBulkRevoke}
                onClear={handleClearSelection}
                isRevoking={isBulkRevoking}
            />

            {filteredPermissions.length === 0 ? (
                <EmptyState variant="no-results" onClearFilters={clearFilters} />
            ) : (
                <div className="permissions-grid">
                    <AnimatePresence mode="popLayout">
                        {filteredPermissions.map((permission, index) => (
                            <PermissionCard
                                key={permission.id}
                                permission={permission}
                                isSelected={selectedIds.has(permission.id)}
                                isRevoking={revokingIds.has(permission.id)}
                                onSelect={handleSelect}
                                onRevoke={onRevoke}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
