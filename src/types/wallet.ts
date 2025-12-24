export interface WalletState {
    address: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    chainId: number | null;
    error: string | null;
}

export interface WalletContextValue extends WalletState {
    connect: () => Promise<void>;
    disconnect: () => void;
}
