import { useState, useEffect } from 'react';
import type { Toast } from '@/types';
import { toastService } from '@/services';

export function useToasts(): Toast[] {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const unsubscribe = toastService.subscribe(setToasts);
        return unsubscribe;
    }, []);

    return toasts;
}
