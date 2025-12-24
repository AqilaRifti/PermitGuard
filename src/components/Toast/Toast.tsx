import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Loader, X } from 'lucide-react';
import type { Toast as ToastType } from '@/types';
import { toastService } from '@/services';
import './Toast.css';

interface ToastProps {
    toasts: ToastType[];
}

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    loading: Loader,
};

export function ToastContainer({ toasts }: ToastProps) {
    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const Icon = icons[toast.type];
                    return (
                        <motion.div
                            key={toast.id}
                            className={`toast toast-${toast.type}`}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Icon
                                size={20}
                                className={`toast-icon ${toast.type === 'loading' ? 'spinning' : ''}`}
                            />
                            <span className="toast-message">{toast.message}</span>
                            {toast.type !== 'loading' && (
                                <button
                                    className="toast-close"
                                    onClick={() => toastService.dismiss(toast.id)}
                                    aria-label="Dismiss"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
