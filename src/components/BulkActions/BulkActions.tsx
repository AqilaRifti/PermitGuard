import { Trash2, X } from 'lucide-react';
import './BulkActions.css';

interface BulkActionsProps {
    selectedCount: number;
    onRevoke: () => void;
    onClear: () => void;
    isRevoking: boolean;
}

export function BulkActions({ selectedCount, onRevoke, onClear, isRevoking }: BulkActionsProps) {
    if (selectedCount === 0) {
        return null;
    }

    return (
        <div className="bulk-actions">
            <span className="bulk-count">
                {selectedCount} permission{selectedCount > 1 ? 's' : ''} selected
            </span>
            <div className="bulk-buttons">
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={onClear}
                    disabled={isRevoking}
                >
                    <X size={14} />
                    Clear
                </button>
                <button
                    className="btn btn-danger"
                    onClick={onRevoke}
                    disabled={isRevoking}
                >
                    {isRevoking ? (
                        <>
                            <span className="spinner-small" />
                            Revoking...
                        </>
                    ) : (
                        <>
                            <Trash2 size={14} />
                            Revoke Selected
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
