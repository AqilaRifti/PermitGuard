import { Search, X, Filter } from 'lucide-react';
import type { FilterState, RiskLevel, PermissionType } from '@/types';
import './SearchFilter.css';

interface SearchFilterProps {
    filters: FilterState;
    onSearchChange: (query: string) => void;
    onRiskLevelChange: (level: RiskLevel | null) => void;
    onPermissionTypeChange: (type: PermissionType | null) => void;
    onClear: () => void;
    hasFilters: boolean;
}

export function SearchFilter({
    filters,
    onSearchChange,
    onRiskLevelChange,
    onPermissionTypeChange,
    onClear,
    hasFilters,
}: SearchFilterProps) {
    return (
        <div className="search-filter">
            <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    className="input search-input"
                    placeholder="Search dApps..."
                    value={filters.searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {filters.searchQuery && (
                    <button
                        className="clear-search"
                        onClick={() => onSearchChange('')}
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="filter-group">
                <Filter size={16} className="filter-icon" />

                <select
                    className="filter-select"
                    value={filters.riskLevel || ''}
                    onChange={(e) => onRiskLevelChange(e.target.value as RiskLevel || null)}
                >
                    <option value="">All Risk Levels</option>
                    <option value="safe">Safe</option>
                    <option value="moderate">Moderate</option>
                    <option value="dangerous">Dangerous</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.permissionType || ''}
                    onChange={(e) => onPermissionTypeChange(e.target.value as PermissionType || null)}
                >
                    <option value="">All Types</option>
                    <option value="read">Read</option>
                    <option value="write">Write</option>
                    <option value="spend">Spend</option>
                </select>

                {hasFilters && (
                    <button className="btn btn-secondary btn-sm" onClick={onClear}>
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
