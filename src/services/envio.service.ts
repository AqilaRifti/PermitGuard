import type { PermissionEvent, PermissionType } from '@/types';

export interface IEnvioService {
    getPermissionHistory(address: string): Promise<PermissionEvent[]>;
    subscribeToEvents(address: string, callback: (event: PermissionEvent) => void): () => void;
}

// Demo history data
const generateDemoHistory = (): PermissionEvent[] => {
    const now = new Date();
    const events: PermissionEvent[] = [];

    const dApps = [
        { name: 'Uniswap', url: 'https://app.uniswap.org' },
        { name: 'OpenSea', url: 'https://opensea.io' },
        { name: 'Aave', url: 'https://app.aave.com' },
        { name: 'Compound', url: 'https://compound.finance' },
        { name: 'Curve', url: 'https://curve.fi' },
        { name: 'SushiSwap', url: 'https://sushi.com' },
    ];

    const permissionTypes: PermissionType[] = ['read', 'write', 'spend'];

    // Generate 15 random events over the past 30 days
    for (let i = 0; i < 15; i++) {
        const dApp = dApps[Math.floor(Math.random() * dApps.length)];
        const daysAgo = Math.floor(Math.random() * 30);
        const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        events.push({
            id: `event-${i}`,
            eventType: Math.random() > 0.3 ? 'grant' : 'revoke',
            dAppName: dApp.name,
            dAppUrl: dApp.url,
            permissionType: permissionTypes[Math.floor(Math.random() * permissionTypes.length)],
            timestamp,
            transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        });
    }

    // Sort by timestamp descending
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

class EnvioService implements IEnvioService {
    private demoHistory: PermissionEvent[] | null = null;

    async getPermissionHistory(address: string): Promise<PermissionEvent[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // In production, this would query Envio's GraphQL API
        // For demo, return generated history
        if (!this.demoHistory) {
            this.demoHistory = generateDemoHistory();
        }

        console.log(`Fetching history for address: ${address}`);
        return this.demoHistory;
    }

    subscribeToEvents(address: string, callback: (event: PermissionEvent) => void): () => void {
        // In production, this would set up a WebSocket subscription to Envio
        // For demo, we simulate occasional new events
        console.log(`Subscribing to events for address: ${address}`);

        const interval = setInterval(() => {
            // 10% chance of new event every 30 seconds
            if (Math.random() < 0.1) {
                const dApps = ['Uniswap', 'OpenSea', 'Aave'];
                const newEvent: PermissionEvent = {
                    id: `event-${Date.now()}`,
                    eventType: Math.random() > 0.5 ? 'grant' : 'revoke',
                    dAppName: dApps[Math.floor(Math.random() * dApps.length)],
                    dAppUrl: 'https://example.com',
                    permissionType: 'write',
                    timestamp: new Date(),
                    transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
                };
                callback(newEvent);
            }
        }, 30000);

        return () => {
            clearInterval(interval);
        };
    }
}

export const envioService = new EnvioService();
