import { ShieldCheck, SearchX } from 'lucide-react';
import './EmptyState.css';

interface EmptyStateProps {
    variant: 'no-permissions' | 'no-results';
    onClearFilters?: () => void;
}

export function EmptyState({ variant, onClearFilters }: EmptyStateProps) {
    if (variant === 'no-results') {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <SearchX size={48} />
                </div>
                <h3 className="empty-title">No matching permissions</h3>
                <p className="empty-description">
                    Try adjusting your search or filters to find what you're looking for.
                </p>
                {onClearFilters && (
                    <button className="btn btn-secondary" onClick={onClearFilters}>
                        Clear Filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="empty-state">
            <div className="empty-icon success">
                <ShieldCheck size={48} />
            </div>
            <h3 className="empty-title">No active permissions</h3>
            <p className="empty-description">
                Your wallet hasn't granted any dApp permissions yet.
                When you connect to dApps and approve permissions, they'll appear here.
            </p>
        </div>
    );
}
