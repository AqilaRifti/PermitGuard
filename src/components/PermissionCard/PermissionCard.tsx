import { motion } from 'framer-motion';
import { Eye, Edit, Coins, Trash2, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { Permission } from '@/types';
import { RiskBadge } from '@/components/RiskBadge';
import './PermissionCard.css';

interface PermissionCardProps {
    permission: Permission;
    isSelected: boolean;
    isRevoking: boolean;
    onSelect: (id: string) => void;
    onRevoke: (id: string) => void;
    index?: number;
}

const typeIcons = {
    read: Eye,
    write: Edit,
    spend: Coins,
};

export function PermissionCard({
    permission,
    isSelected,
    isRevoking,
    onSelect,
    onRevoke,
    index = 0,
}: PermissionCardProps) {
    const TypeIcon = typeIcons[permission.permissionType];
    const hasExpiry = permission.expiresAt !== null;
    const isExpired = hasExpiry && permission.expiresAt! < new Date();

    return (
        <motion.div
            className={`permission-card ${isSelected ? 'selected' : ''} ${isRevoking ? 'revoking' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
        >
            <div className="card-header">
                <input
                    type="checkbox"
                    className="card-checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(permission.id)}
                    disabled={isRevoking}
                />
                <div className="dapp-icon">{permission.dAppIcon || '🔗'}</div>
                <div className="dapp-info">
                    <h3 className="dapp-name">{permission.dAppName}</h3>
                    <a
                        href={permission.dAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dapp-url"
                    >
                        {new URL(permission.dAppUrl).hostname}
                        <ExternalLink size={11} />
                    </a>
                </div>
                <RiskBadge level={permission.riskLevel} />
            </div>

            <div className="card-body">
                <div className="permission-details">
                    <div className="detail-item">
                        <span className="detail-label">Permission Type</span>
                        <span className="detail-value">
                            <TypeIcon size={14} />
                            {permission.permissionType.charAt(0).toUpperCase() + permission.permissionType.slice(1)}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">Access Level</span>
                        <span className={`detail-value ${permission.accessLevel === 'unlimited' ? 'access-level-unlimited' : 'access-level'}`}>
                            {permission.accessLevel === 'unlimited' && <AlertTriangle size={14} />}
                            {permission.accessLevel === 'unlimited' ? 'Unlimited' : permission.accessLevel}
                        </span>
                    </div>

                    {permission.spendLimit && (
                        <div className="detail-item">
                            <span className="detail-label">Spend Limit</span>
                            <span className="detail-value">
                                {permission.spendLimit.amount} {permission.spendLimit.token}
                            </span>
                        </div>
                    )}

                    <div className="detail-item">
                        <span className="detail-label">Granted</span>
                        <span className="detail-value" title={format(permission.grantedAt, 'PPpp')}>
                            {formatDistanceToNow(permission.grantedAt, { addSuffix: true })}
                        </span>
                    </div>

                    {hasExpiry && (
                        <div className={`detail-item ${isExpired ? 'expired' : ''}`}>
                            <span className="detail-label">
                                <Clock size={12} />
                                {isExpired ? 'Expired' : 'Expires'}
                            </span>
                            <span className="detail-value">
                                {formatDistanceToNow(permission.expiresAt!, { addSuffix: true })}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="card-footer">
                <button
                    className="btn btn-danger revoke-btn"
                    onClick={() => onRevoke(permission.id)}
                    disabled={isRevoking}
                >
                    {isRevoking ? (
                        <>
                            <span className="spinner-small" />
                            Revoking...
                        </>
                    ) : (
                        <>
                            <Trash2 size={15} />
                            Revoke Access
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
