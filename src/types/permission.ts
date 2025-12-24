export type PermissionType = 'read' | 'write' | 'spend';
export type AccessLevel = 'readonly' | 'write' | 'unlimited';
export type RiskLevel = 'safe' | 'moderate' | 'dangerous';

export interface SpendLimit {
    amount: string;
    token: string;
    tokenAddress: string;
}

export interface Permission {
    id: string;
    dAppName: string;
    dAppUrl: string;
    dAppIcon: string | null;
    permissionType: PermissionType;
    accessLevel: AccessLevel;
    spendLimit: SpendLimit | null;
    grantedAt: Date;
    expiresAt: Date | null;
    riskLevel: RiskLevel;
}
