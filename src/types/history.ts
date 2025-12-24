import type { PermissionType } from './permission';

export type EventType = 'grant' | 'revoke';

export interface PermissionEvent {
    id: string;
    eventType: EventType;
    dAppName: string;
    dAppUrl: string;
    permissionType: PermissionType;
    timestamp: Date;
    transactionHash: string;
}
