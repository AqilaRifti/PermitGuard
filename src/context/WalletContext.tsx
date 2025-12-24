import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { WalletState, WalletContextValue } from '@/types';
import { metamaskService, toastService } from '@/services';

const STORAGE_KEY = 'metamask-dashboard-last-address';

const initialState: WalletState = {
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    error: null,
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WalletState>(initialState);

    const connect = useCallback(async () => {
        if (!metamaskService.isMetaMaskInstalled()) {
            toastService.error('MetaMask is not installed. Please install it to continue.');
            setState(prev => ({ ...prev, error: 'MetaMask not installed' }));
            return;
        }

        setState(prev => ({ ...prev, isConnecting: true, error: null }));

        try {
            const address = await metamaskService.connect();
            localStorage.setItem(STORAGE_KEY, address);

            setState({
                address,
                isConnected: true,
                isConnecting: false,
                chainId: null,
                error: null,
            });

            toastService.success('Wallet connected successfully!');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to connect wallet';
            setState(prev => ({
                ...prev,
                isConnecting: false,
                error: message,
            }));
            toastService.error(message);
        }
    }, []);

    const disconnect = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setState(initialState);
        toastService.success('Wallet disconnected');
    }, []);

    // Listen for account changes
    useEffect(() => {
        const unsubscribe = metamaskService.onAccountChange((address) => {
            if (address) {
                localStorage.setItem(STORAGE_KEY, address);
                setState(prev => ({ ...prev, address, isConnected: true }));
            } else {
                localStorage.removeItem(STORAGE_KEY);
                setState(initialState);
            }
        });

        return unsubscribe;
    }, []);

    // Listen for chain changes
    useEffect(() => {
        const unsubscribe = metamaskService.onChainChange((chainId) => {
            setState(prev => ({ ...prev, chainId }));
        });

        return unsubscribe;
    }, []);

    // Auto-connect if previously connected
    useEffect(() => {
        const lastAddress = localStorage.getItem(STORAGE_KEY);
        if (lastAddress && metamaskService.isMetaMaskInstalled()) {
            connect();
        }
    }, [connect]);

    const value: WalletContextValue = {
        ...state,
        connect,
        disconnect,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet(): WalletContextValue {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
