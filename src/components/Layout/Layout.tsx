import type { ReactNode } from 'react';
import { Shield } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="layout">
            <div className="layout-bg" />
            <div className="layout-content">
                <nav className="layout-nav">
                    <div className="nav-brand">
                        <Shield size={24} className="nav-logo" />
                        <span className="nav-title">PermitGuard</span>
                    </div>
                </nav>
                {children}
            </div>
        </div>
    );
}
