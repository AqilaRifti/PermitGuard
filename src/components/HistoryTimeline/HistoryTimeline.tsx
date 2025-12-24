import { motion } from 'framer-motion';
import { Plus, Minus, AlertCircle, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { PermissionEvent } from '@/types';
import './HistoryTimeline.css';

interface HistoryTimelineProps {
    events: PermissionEvent[];
    isLoading: boolean;
    error: string | null;
}

export function HistoryTimeline({ events, isLoading, error }: HistoryTimelineProps) {
    if (error) {
        return (
            <div className="history-section">
                <h2 className="history-title">
                    <Clock size={20} />
                    Permission History
                </h2>
                <div className="history-error">
                    <AlertCircle size={20} />
                    <span>Unable to load history. Showing current permissions only.</span>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="history-section">
                <h2 className="history-title">
                    <Clock size={20} />
                    Permission History
                </h2>
                <div className="history-timeline">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="history-event skeleton-event">
                            <div className="skeleton event-skeleton-icon" />
                            <div className="event-content">
                                <div className="skeleton event-skeleton-title" />
                                <div className="skeleton event-skeleton-time" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return null;
    }

    return (
        <div className="history-section">
            <h2 className="history-title">
                <Clock size={20} />
                Permission History
            </h2>
            <div className="history-timeline">
                {events.slice(0, 10).map((event, index) => (
                    <motion.div
                        key={event.id}
                        className={`history-event ${event.eventType}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className={`event-icon ${event.eventType}`}>
                            {event.eventType === 'grant' ? <Plus size={14} /> : <Minus size={14} />}
                        </div>
                        <div className="event-content">
                            <div className="event-header">
                                <span className="event-action">
                                    {event.eventType === 'grant' ? 'Granted' : 'Revoked'}
                                </span>
                                <span className="event-type">{event.permissionType}</span>
                                <span className="event-dapp">to {event.dAppName}</span>
                            </div>
                            <time
                                className="event-time"
                                title={format(event.timestamp, 'PPpp')}
                            >
                                {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                            </time>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
