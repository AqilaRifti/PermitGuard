import { useWallet } from '@/context/WalletContext';
import { ConnectButton } from '@/components/ConnectButton';
import { LogOut, Shield, Zap, Eye } from 'lucide-react';
import './HeroSection.css';

export function HeroSection() {
    const { isConnected, address, disconnect } = useWallet();

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <section className="hero">
            <div className="hero-badge">
                <span className="hero-badge-dot" />
                Web3 Security Dashboard
            </div>

            <h1 className="hero-title">
                <span className="hero-title-line hero-title-gradient">Take Control</span>
                <span className="hero-title-line hero-title-accent">of Your Wallet</span>
            </h1>

            <p className="hero-subtitle">
                View and manage all dApp permissions granted to your wallet.
                Protect your assets by revoking unnecessary access with one click.
            </p>

            {isConnected && address ? (
                <div className="hero-wallet">
                    <div className="wallet-info">
                        <div className="wallet-address">
                            <span className="wallet-dot" />
                            {truncateAddress(address)}
                        </div>
                        <div className="wallet-divider" />
                        <button className="disconnect-btn" onClick={disconnect}>
                            <LogOut size={16} />
                            Disconnect
                        </button>
                    </div>
                </div>
            ) : (
                <div className="hero-actions">
                    <ConnectButton />
                </div>
            )}

            {!isConnected && (
                <div className="hero-features">
                    <div className="hero-feature">
                        <h3 className="hero-feature-title">
                            <Shield size={16} style={{ marginRight: '8px', color: '#8b5cf6' }} />
                            Risk Assessment
                        </h3>
                        <p className="hero-feature-desc">
                            Color-coded risk levels help you identify dangerous permissions at a glance.
                        </p>
                    </div>
                    <div className="hero-feature">
                        <h3 className="hero-feature-title">
                            <Zap size={16} style={{ marginRight: '8px', color: '#8b5cf6' }} />
                            One-Click Revoke
                        </h3>
                        <p className="hero-feature-desc">
                            Remove single or bulk permissions instantly with our streamlined interface.
                        </p>
                    </div>
                    <div className="hero-feature">
                        <h3 className="hero-feature-title">
                            <Eye size={16} style={{ marginRight: '8px', color: '#8b5cf6' }} />
                            Full Visibility
                        </h3>
                        <p className="hero-feature-desc">
                            See every permission, spend limit, and expiration date in one dashboard.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
