import type { Toast, ToastType } from '@/types';

export interface IToastService {
    success(message: string): string;
    error(message: string): string;
    warning(message: string): string;
    loading(message: string): string;
    dismiss(toastId: string): void;
    subscribe(callback: (toasts: Toast[]) => void): () => void;
}

type ToastCallback = (toasts: Toast[]) => void;

class ToastService implements IToastService {
    private toasts: Toast[] = [];
    private subscribers: Set<ToastCallback> = new Set();
    private idCounter = 0;

    private notify(): void {
        this.subscribers.forEach(callback => callback([...this.toasts]));
    }

    private addToast(type: ToastType, message: string, duration?: number): string {
        const id = `toast-${++this.idCounter}`;
        const toast: Toast = { id, type, message, duration };

        this.toasts.push(toast);
        this.notify();

        // Auto-dismiss after duration (default 5s, loading toasts don't auto-dismiss)
        if (type !== 'loading') {
            const dismissAfter = duration ?? 5000;
            setTimeout(() => this.dismiss(id), dismissAfter);
        }

        return id;
    }

    success(message: string): string {
        return this.addToast('success', message);
    }

    error(message: string): string {
        return this.addToast('error', message, 7000);
    }

    warning(message: string): string {
        return this.addToast('warning', message, 6000);
    }

    loading(message: string): string {
        return this.addToast('loading', message);
    }

    dismiss(toastId: string): void {
        this.toasts = this.toasts.filter(t => t.id !== toastId);
        this.notify();
    }

    subscribe(callback: ToastCallback): () => void {
        this.subscribers.add(callback);
        callback([...this.toasts]);

        return () => {
            this.subscribers.delete(callback);
        };
    }
}

export const toastService = new ToastService();
