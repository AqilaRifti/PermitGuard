import './SkeletonCard.css';

export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-header">
                <div className="skeleton skeleton-checkbox" />
                <div className="skeleton skeleton-icon" />
                <div className="skeleton-info">
                    <div className="skeleton skeleton-title" />
                    <div className="skeleton skeleton-url" />
                </div>
                <div className="skeleton skeleton-badge" />
            </div>
            <div className="skeleton-body">
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />
            </div>
            <div className="skeleton-footer">
                <div className="skeleton skeleton-button" />
            </div>
        </div>
    );
}
