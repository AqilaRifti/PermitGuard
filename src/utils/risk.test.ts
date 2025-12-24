import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateRiskLevel, calculateOverallRiskScore, countByRiskLevel } from './risk';
import type { Permission, AccessLevel, SpendLimit, RiskLevel } from '@/types';

/**
 * **Feature: metamask-permissions-dashboard, Property 3: Risk Level Determinism**
 * *For any* permission with a given accessLevel and spendLimit, the calculated RiskLevel
 * SHALL always be the same value (readonly→safe, unlimited→dangerous, write→moderate).
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 */
describe('Risk Level Calculation - Property Tests', () => {
    // Arbitrary for hex address
    const hexAddressArb = fc.array(
        fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'),
        { minLength: 40, maxLength: 40 }
    ).map(arr => `0x${arr.join('')}`);

    // Arbitrary for SpendLimit
    const spendLimitArb = fc.record({
        amount: fc.oneof(
            fc.float({ min: 0, max: 10000, noNaN: true }).map(String),
            fc.constant('0'),
            fc.constant('500'),
            fc.constant('1500')
        ),
        token: fc.string({ minLength: 1, maxLength: 10 }),
        tokenAddress: hexAddressArb,
    });

    const accessLevelArb: fc.Arbitrary<AccessLevel> = fc.constantFrom('readonly', 'write', 'unlimited');

    it('Property 3.1: readonly access always returns safe', () => {
        fc.assert(
            fc.property(
                fc.option(spendLimitArb, { nil: null }),
                (spendLimit) => {
                    const result = calculateRiskLevel('readonly', spendLimit);
                    expect(result).toBe('safe');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.2: unlimited access always returns dangerous', () => {
        fc.assert(
            fc.property(
                fc.option(spendLimitArb, { nil: null }),
                (spendLimit) => {
                    const result = calculateRiskLevel('unlimited', spendLimit);
                    expect(result).toBe('dangerous');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.3: write access without spend limit returns moderate', () => {
        const result = calculateRiskLevel('write', null);
        expect(result).toBe('moderate');
    });

    it('Property 3.4: write access with high spend limit (>1000) returns dangerous', () => {
        fc.assert(
            fc.property(
                fc.float({ min: 1001, max: 100000, noNaN: true }),
                fc.string({ minLength: 1, maxLength: 10 }),
                hexAddressArb,
                (amount, token, tokenAddress) => {
                    const spendLimit: SpendLimit = {
                        amount: amount.toString(),
                        token,
                        tokenAddress,
                    };
                    const result = calculateRiskLevel('write', spendLimit);
                    expect(result).toBe('dangerous');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.5: write access with low spend limit (<=1000) returns moderate', () => {
        fc.assert(
            fc.property(
                fc.float({ min: 0, max: 1000, noNaN: true }),
                fc.string({ minLength: 1, maxLength: 10 }),
                hexAddressArb,
                (amount, token, tokenAddress) => {
                    const spendLimit: SpendLimit = {
                        amount: amount.toString(),
                        token,
                        tokenAddress,
                    };
                    const result = calculateRiskLevel('write', spendLimit);
                    expect(result).toBe('moderate');
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 3.6: calculateRiskLevel is deterministic (same input → same output)', () => {
        fc.assert(
            fc.property(
                accessLevelArb,
                fc.option(spendLimitArb, { nil: null }),
                (accessLevel, spendLimit) => {
                    const result1 = calculateRiskLevel(accessLevel, spendLimit);
                    const result2 = calculateRiskLevel(accessLevel, spendLimit);
                    expect(result1).toBe(result2);
                }
            ),
            { numRuns: 100 }
        );
    });
});

describe('Overall Risk Score Calculation', () => {
    const createPermission = (riskLevel: RiskLevel): Permission => ({
        id: Math.random().toString(),
        dAppName: 'Test dApp',
        dAppUrl: 'https://test.com',
        dAppIcon: null,
        permissionType: 'read',
        accessLevel: 'readonly',
        spendLimit: null,
        grantedAt: new Date(),
        expiresAt: null,
        riskLevel,
    });

    it('returns 0 for empty permissions array', () => {
        expect(calculateOverallRiskScore([])).toBe(0);
    });

    it('returns 0 for all safe permissions', () => {
        const permissions = [createPermission('safe'), createPermission('safe')];
        expect(calculateOverallRiskScore(permissions)).toBe(0);
    });

    it('returns 100 for all dangerous permissions', () => {
        const permissions = [createPermission('dangerous'), createPermission('dangerous')];
        expect(calculateOverallRiskScore(permissions)).toBe(100);
    });

    it('returns 50 for all moderate permissions', () => {
        const permissions = [createPermission('moderate'), createPermission('moderate')];
        expect(calculateOverallRiskScore(permissions)).toBe(50);
    });

    it('calculates weighted average correctly', () => {
        const permissions = [
            createPermission('safe'),      // 0
            createPermission('moderate'),  // 50
            createPermission('dangerous'), // 100
        ];
        // (0 + 50 + 100) / 3 = 50
        expect(calculateOverallRiskScore(permissions)).toBe(50);
    });
});

describe('Count By Risk Level', () => {
    const createPermission = (riskLevel: RiskLevel): Permission => ({
        id: Math.random().toString(),
        dAppName: 'Test dApp',
        dAppUrl: 'https://test.com',
        dAppIcon: null,
        permissionType: 'read',
        accessLevel: 'readonly',
        spendLimit: null,
        grantedAt: new Date(),
        expiresAt: null,
        riskLevel,
    });

    it('counts permissions correctly by risk level', () => {
        const permissions = [
            createPermission('safe'),
            createPermission('safe'),
            createPermission('moderate'),
            createPermission('dangerous'),
            createPermission('dangerous'),
            createPermission('dangerous'),
        ];

        const counts = countByRiskLevel(permissions);
        expect(counts.safe).toBe(2);
        expect(counts.moderate).toBe(1);
        expect(counts.dangerous).toBe(3);
    });

    it('returns zeros for empty array', () => {
        const counts = countByRiskLevel([]);
        expect(counts.safe).toBe(0);
        expect(counts.moderate).toBe(0);
        expect(counts.dangerous).toBe(0);
    });
});
