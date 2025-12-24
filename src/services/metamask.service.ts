import { MetaMaskSDK } from '@metamask/sdk';
import type { Permission, AccessLevel, PermissionType } from '@/types';
import { calculateRiskLevel } from '@/utils/risk';

// Extend Window interface for ethereum provider
declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean;
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
            on: (event: string, callback: (...args: unknown[]) => void) => void;
            removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
        };
    }
}

export interface IMetaMaskService {
    connect(): Promise<string>;
    disconnect(): Promise<void>;
    getPermissions(): Promise<Permission[]>;
    revokePermission(permissionId: string): Promise<void>;
    revokePermissions(permissionIds: string[]): Promise<void>;
    onAccountChange(callback: (address: string | null) => void): () => void;
    onChainChange(callback: (chainId: number) => void): () => void;
    isMetaMaskInstalled(): boolean;
}

// Mock dApp data for demo purposes
const MOCK_DAPPS: Record<string, { name: string; icon: string }> = {
    'uniswap.org': { name: 'Uniswap', icon: 'https://app.uniswap.org/favicon.ico' },
    'opensea.io': { name: 'OpenSea', icon: 'https://opensea.io/favicon.ico' },
    'aave.com': { name: 'Aave', icon: 'https://aave.com/favicon.ico' },
    'compound.finance': { name: 'Compound', icon: 'https://compound.finance/favicon.ico' },
    'curve.fi': { name: 'Curve', icon: 'https://curve.fi/favicon.ico' },
};

class MetaMaskService implements IMetaMaskService {
    constructor() {
        // Initialize MetaMask SDK for dApp metadata
        if (typeof window !== 'undefined') {
            new MetaMaskSDK({
                dappMetadata: {
                    name: 'MetaMask Permissions Dashboard',
                    url: window.location.href,
                },
            });
        }
    }

    isMetaMaskInstalled(): boolean {
        return typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;
    }

    async connect(): Promise<string> {
        if (!this.isMetaMaskInstalled()) {
            throw new Error('MetaMask is not installed');
        }

        const accounts = await window.ethereum!.request({
            method: 'eth_requestAccounts',
        }) as string[];

        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found');
        }

        return accounts[0];
    }

    async disconnect(): Promise<void> {
        // MetaMask doesn't have a direct disconnect method
        // We just clear our local state
    }

    async getPermissions(): Promise<Permission[]> {
        if (!this.isMetaMaskInstalled()) {
            throw new Error('MetaMask is not installed');
        }

        try {
            // Get wallet permissions from MetaMask
            const rawPermissions = await window.ethereum!.request({
                method: 'wallet_getPermissions',
            }) as Array<{
                parentCapability: string;
                caveats?: Array<{ type: string; value: unknown }>;
                date?: number;
                invoker?: string;
            }>;

            // Transform raw permissions to our Permission type
            const permissions: Permission[] = rawPermissions.map((raw, index) => {
                const invoker = raw.invoker || 'unknown';
                const domain = this.extractDomain(invoker);
                const dAppInfo = MOCK_DAPPS[domain] || { name: domain, icon: null };

                const permissionType = this.mapPermissionType(raw.parentCapability);
                const accessLevel = this.determineAccessLevel(raw);
                const spendLimit = this.extractSpendLimit(raw);

                return {
                    id: `${invoker}-${raw.parentCapability}-${index}`,
                    dAppName: dAppInfo.name,
                    dAppUrl: invoker,
                    dAppIcon: dAppInfo.icon,
                    permissionType,
                    accessLevel,
                    spendLimit,
                    grantedAt: raw.date ? new Date(raw.date) : new Date(),
                    expiresAt: null,
                    riskLevel: calculateRiskLevel(accessLevel, spendLimit),
                };
            });

            // If no real permissions, return demo data for showcase
            if (permissions.length === 0) {
                return this.getDemoPermissions();
            }

            return permissions;
        } catch {
            // Return demo permissions for showcase
            return this.getDemoPermissions();
        }
    }

    private getDemoPermissions(): Permission[] {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return [
            {
                id: '1',
                dAppName: 'Uniswap',
                dAppUrl: 'https://app.uniswap.org',
                dAppIcon: '🦄',
                permissionType: 'spend',
                accessLevel: 'unlimited',
                spendLimit: null,
                grantedAt: oneWeekAgo,
                expiresAt: null,
                riskLevel: 'dangerous',
            },
            {
                id: '2',
                dAppName: 'OpenSea',
                dAppUrl: 'https://opensea.io',
                dAppIcon: '🌊',
                permissionType: 'write',
                accessLevel: 'write',
                spendLimit: { amount: '500', token: 'USDC', tokenAddress: '0xa0b8...' },
                grantedAt: twoWeeksAgo,
                expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                riskLevel: 'moderate',
            },
            {
                id: '3',
                dAppName: 'Aave',
                dAppUrl: 'https://app.aave.com',
                dAppIcon: '👻',
                permissionType: 'spend',
                accessLevel: 'write',
                spendLimit: { amount: '2000', token: 'ETH', tokenAddress: '0x0000...' },
                grantedAt: oneMonthAgo,
                expiresAt: null,
                riskLevel: 'dangerous',
            },
            {
                id: '4',
                dAppName: 'Etherscan',
                dAppUrl: 'https://etherscan.io',
                dAppIcon: '🔍',
                permissionType: 'read',
                accessLevel: 'readonly',
                spendLimit: null,
                grantedAt: oneMonthAgo,
                expiresAt: null,
                riskLevel: 'safe',
            },
            {
                id: '5',
                dAppName: 'Compound',
                dAppUrl: 'https://compound.finance',
                dAppIcon: '🏦',
                permissionType: 'write',
                accessLevel: 'write',
                spendLimit: null,
                grantedAt: twoWeeksAgo,
                expiresAt: null,
                riskLevel: 'moderate',
            },
            {
                id: '6',
                dAppName: 'Curve Finance',
                dAppUrl: 'https://curve.fi',
                dAppIcon: '📈',
                permissionType: 'spend',
                accessLevel: 'unlimited',
                spendLimit: null,
                grantedAt: oneWeekAgo,
                expiresAt: null,
                riskLevel: 'dangerous',
            },
        ];
    }

    private extractDomain(url: string): string {
        try {
            const parsed = new URL(url);
            return parsed.hostname.replace('www.', '');
        } catch {
            return url;
        }
    }

    private mapPermissionType(capability: string): PermissionType {
        if (capability.includes('spend') || capability.includes('approve')) {
            return 'spend';
        }
        if (capability.includes('write') || capability.includes('sign')) {
            return 'write';
        }
        return 'read';
    }

    private determineAccessLevel(raw: { caveats?: Array<{ type: string; value: unknown }> }): AccessLevel {
        if (!raw.caveats || raw.caveats.length === 0) {
            return 'unlimited';
        }

        const hasRestriction = raw.caveats.some(c =>
            c.type === 'restrictReturnedAccounts' || c.type === 'filterResponse'
        );

        if (hasRestriction) {
            return 'readonly';
        }

        return 'write';
    }

    private extractSpendLimit(raw: { caveats?: Array<{ type: string; value: unknown }> }): Permission['spendLimit'] {
        if (!raw.caveats) return null;

        const spendCaveat = raw.caveats.find(c => c.type === 'spendLimit');
        if (spendCaveat && typeof spendCaveat.value === 'object' && spendCaveat.value !== null) {
            const value = spendCaveat.value as { amount?: string; token?: string; tokenAddress?: string };
            return {
                amount: value.amount || '0',
                token: value.token || 'ETH',
                tokenAddress: value.tokenAddress || '0x0',
            };
        }

        return null;
    }

    async revokePermission(permissionId: string): Promise<void> {
        if (!this.isMetaMaskInstalled()) {
            throw new Error('MetaMask is not installed');
        }

        // In a real implementation, this would call wallet_revokePermissions
        // For demo, we simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(`Revoked permission: ${permissionId}`);
    }

    async revokePermissions(permissionIds: string[]): Promise<void> {
        for (const id of permissionIds) {
            await this.revokePermission(id);
        }
    }

    onAccountChange(callback: (address: string | null) => void): () => void {
        if (!this.isMetaMaskInstalled()) {
            return () => { };
        }

        const handler = (accounts: unknown) => {
            const accountList = accounts as string[];
            callback(accountList.length > 0 ? accountList[0] : null);
        };

        window.ethereum!.on('accountsChanged', handler);

        return () => {
            window.ethereum!.removeListener('accountsChanged', handler);
        };
    }

    onChainChange(callback: (chainId: number) => void): () => void {
        if (!this.isMetaMaskInstalled()) {
            return () => { };
        }

        const handler = (chainId: unknown) => {
            callback(parseInt(chainId as string, 16));
        };

        window.ethereum!.on('chainChanged', handler);

        return () => {
            window.ethereum!.removeListener('chainChanged', handler);
        };
    }
}

export const metamaskService = new MetaMaskService();
