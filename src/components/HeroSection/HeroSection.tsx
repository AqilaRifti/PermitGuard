import { useWallet } from '@/context/WalletContext';
import { ConnectButton } from '@/components/ConnectButton';
import './HeroSection.css';

export function HeroSection() {
    const { isConnected, address, disconnect } = useWallet();

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <section className="hero">
            <h1 className="hero-title">
                MetaMask Permissions Dashboard
            </h1>
            <p className="hero-subtitle">
                View and manage all dApp permissions granted to your wallet.
                Protect your assets by revoking unnecessary access.
            </p>

            {isConnected && address ? (
                <div className="hero-wallet">
                    <div className="wallet-address">
                        <span className="wallet-dot" />
                        {truncateAddress(address)}
                    </div>
                    <button className="btn btn-secondary" onClick={disconnect}>
                        Disconnect
                    </button>
                </div>
            ) : (
                <ConnectButton />
            )}
        </section>
    );
}
