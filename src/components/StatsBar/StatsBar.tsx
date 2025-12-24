import { motion } from 'framer-motion';
import { Shield, AlertTriangle, AlertOctagon, Activity, Gauge } from 'lucide-react';
import type { DashboardStats } from '@/types';
import './StatsBar.css';

interface StatsBarProps {
    stats: DashboardStats;
    isLoading: boolean;
}

export function StatsBar({ stats, isLoading }: StatsBarProps) {
    const getRiskColor = (score: number) => {
        if (score < 30) return 'var(--color-safe)';
        if (score < 70) return 'var(--color-moderate)';
        return 'var(--color-dangerous)';
    };

    if (isLoading) {
        return (
            <div className="stats-bar">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="stat-card">
                        <div className="skeleton stat-skeleton-icon" />
                        <div className="stat-content">
                            <div className="skeleton stat-skeleton-value" />
                            <div className="skeleton stat-skeleton-label" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="stats-bar">
            <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
            >
                <div className="stat-icon">
                    <Activity size={20} />
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats.totalPermissions}</span>
                    <span className="stat-label">Total Permissions</span>
                </div>
            </motion.div>

            <motion.div
                className="stat-card safe"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
            >
                <div className="stat-icon">
                    <Shield size={20} />
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats.safeCount}</span>
                    <span className="stat-label">Safe</span>
                </div>
            </motion.div>

            <motion.div
                className="stat-card moderate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="stat-icon">
                    <AlertTriangle size={20} />
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats.moderateCount}</span>
                    <span className="stat-label">Moderate</span>
                </div>
            </motion.div>

            <motion.div
                className="stat-card dangerous"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div className="stat-icon">
                    <AlertOctagon size={20} />
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats.dangerousCount}</span>
                    <span className="stat-label">Dangerous</span>
                </div>
            </motion.div>

            <motion.div
                className="stat-card risk-score"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="stat-icon">
                    <Gauge size={20} />
                </div>
                <div className="stat-content">
                    <span className="stat-value" style={{ color: getRiskColor(stats.overallRiskScore) }}>
                        {stats.overallRiskScore}%
                    </span>
                    <span className="stat-label">Risk Score</span>
                </div>
                <div className="risk-bar">
                    <div
                        className="risk-bar-fill"
                        style={{
                            width: `${stats.overallRiskScore}%`,
                            background: getRiskColor(stats.overallRiskScore),
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
