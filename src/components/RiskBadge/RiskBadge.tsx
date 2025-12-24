import { Shield, AlertTriangle, AlertOctagon } from 'lucide-react';
import type { RiskLevel } from '@/types';
import './RiskBadge.css';

interface RiskBadgeProps {
    level: RiskLevel;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const config: Record<RiskLevel, { label: string; Icon: typeof Shield }> = {
    safe: { label: 'Safe', Icon: Shield },
    moderate: { label: 'Moderate', Icon: AlertTriangle },
    dangerous: { label: 'Dangerous', Icon: AlertOctagon },
};

export function RiskBadge({ level, size = 'md', showLabel = true }: RiskBadgeProps) {
    const { label, Icon } = config[level];
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

    return (
        <span className={`risk-badge risk-badge-${level} risk-badge-${size}`}>
            <Icon size={iconSize} />
            {showLabel && <span>{label}</span>}
        </span>
    );
}
