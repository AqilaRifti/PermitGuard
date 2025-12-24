import { Wallet } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { metamaskService } from '@/services';
import './ConnectButton.css';

export function ConnectButton() {
    const { connect, isConnecting } = useWallet();
    const isInstalled = metamaskService.isMetaMaskInstalled();

    if (!isInstalled) {
        return (
            <div className="connect-wrapper">
                <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg connect-btn"
                >
                    <Wallet size={20} />
                    Install MetaMask
                </a>
                <p className="connect-hint">
                    MetaMask is required to use this dashboard
                </p>
            </div>
        );
    }

    return (
        <button
            className="btn btn-primary btn-lg connect-btn"
            onClick={connect}
            disabled={isConnecting}
        >
            {isConnecting ? (
                <>
                    <span className="spinner" />
                    Connecting...
                </>
            ) : (
                <>
                    <Wallet size={20} />
                    Connect MetaMask
                </>
            )}
        </button>
    );
}
