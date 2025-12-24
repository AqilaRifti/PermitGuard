import type { Permission, RiskLevel, AccessLevel, SpendLimit } from '@/types';

const HIGH_SPEND_THRESHOLD = 1000;

/**
 * Calculates the risk level for a permission based on access level and spend limits.
 * - readonly access → safe (green)
 * - unlimited access → dangerous (red)
 * - write access without spend limit → moderate (yellow)
 * - write access with high spend limit (>1000) → dangerous (red)
 * - write access with low spend limit → moderate (yellow)
 */
export function calculateRiskLevel(
    accessLevel: AccessLevel,
    spendLimit: SpendLimit | null
): RiskLevel {
    if (accessLevel === 'readonly') {
        return 'safe';
    }

    if (accessLevel === 'unlimited') {
        return 'dangerous';
    }

    if (accessLevel === 'write') {
        if (spendLimit !== null) {
            const limitValue = parseFloat(spendLimit.amount);
            if (!isNaN(limitValue) && limitValue > HIGH_SPEND_THRESHOLD) {
                return 'dangerous';
            }
        }
        return 'moderate';
    }

    return 'moderate';
}

/**
 * Calculates the overall risk score for a set of permissions.
 * Returns a value between 0 (all safe) and 100 (all dangerous).
 */
export function calculateOverallRiskScore(permissions: Permission[]): number {
    if (permissions.length === 0) {
        return 0;
    }

    const weights: Record<RiskLevel, number> = {
        safe: 0,
        moderate: 50,
        dangerous: 100,
    };

    const totalWeight = permissions.reduce(
        (sum, permission) => sum + weights[permission.riskLevel],
        0
    );

    return Math.round(totalWeight / permissions.length);
}

/**
 * Counts permissions by risk level.
 */
export function countByRiskLevel(permissions: Permission[]): Record<RiskLevel, number> {
    return permissions.reduce(
        (counts, permission) => {
            counts[permission.riskLevel]++;
            return counts;
        },
        { safe: 0, moderate: 0, dangerous: 0 } as Record<RiskLevel, number>
    );
}
