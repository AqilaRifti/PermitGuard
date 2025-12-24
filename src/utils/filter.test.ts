import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { filterBySearch, filterByRiskLevel, filterByPermissionType, applyFilters } from './filter';
import type { Permission, RiskLevel, PermissionType, FilterState } from '@/types';

// Arbitrary for Permission
const riskLevelArb: fc.Arbitrary<RiskLevel> = fc.constantFrom('safe', 'moderate', 'dangerous');
const permissionTypeArb: fc.Arbitrary<PermissionType> = fc.constantFrom('read', 'write', 'spend');

const permissionArb: fc.Arbitrary<Permission> = fc.record({
    id: fc.uuid(),
    dAppName: fc.string({ minLength: 1, maxLength: 50 }),
    dAppUrl: fc.webUrl(),
    dAppIcon: fc.option(fc.webUrl(), { nil: null }),
    permissionType: permissionTypeArb,
    accessLevel: fc.constantFrom('readonly', 'write', 'unlimited'),
    spendLimit: fc.constant(null),
    grantedAt: fc.date(),
    expiresAt: fc.option(fc.date(), { nil: null }),
    riskLevel: riskLevelArb,
});

const permissionsArb = fc.array(permissionArb, { minLength: 0, maxLength: 20 });

/**
 * **Feature: permitguard, Property 5: Filter Result Correctness**
 * *For any* applied filter (search query, risk level, or permission type), all displayed
 * Permission_Cards SHALL match the filter criteria, and no matching permissions SHALL be hidden.
 * **Validates: Requirements 6.2, 6.3, 6.4**
 */
describe('Filter Utilities - Property Tests', () => {
    describe('filterBySearch', () => {
        it('Property 5.1: all returned items contain the search query in name or URL', () => {
            fc.assert(
                fc.property(
                    permissionsArb,
                    fc.string({ minLength: 1, maxLength: 10 }),
                    (permissions, query) => {
                        const result = filterBySearch(permissions, query);
                        const lowerQuery = query.toLowerCase().trim();

                        // All results should match
                        result.forEach(p => {
                            const matches =
                                p.dAppName.toLowerCase().includes(lowerQuery) ||
                                p.dAppUrl.toLowerCase().includes(lowerQuery);
                            expect(matches).toBe(true);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('Property 5.2: no matching items are excluded from search results', () => {
            fc.assert(
                fc.property(
                    permissionsArb,
                    fc.string({ minLength: 1, maxLength: 10 }),
                    (permissions, query) => {
                        const result = filterBySearch(permissions, query);
                        const lowerQuery = query.toLowerCase().trim();

                        // Count matching items in original
                        const expectedCount = permissions.filter(p =>
                            p.dAppName.toLowerCase().includes(lowerQuery) ||
                            p.dAppUrl.toLowerCase().includes(lowerQuery)
                        ).length;

                        expect(result.length).toBe(expectedCount);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('Property 5.3: empty query returns all permissions', () => {
            fc.assert(
                fc.property(
                    permissionsArb,
                    fc.constantFrom('', '   ', '\t'),
                    (permissions, emptyQuery) => {
                        const result = filterBySearch(permissions, emptyQuery);
                        expect(result.length).toBe(permissions.length);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('filterByRiskLevel', () => {
        it('Property 5.4: all returned items match the risk level filter', () => {
            fc.assert(
                fc.property(
                    permissionsArb,
                    riskLevelArb,
                    (permissions, riskLevel) => {
                        const result = filterByRiskLevel(permissions, riskLevel);
                        result.forEach(p => {
                            expect(p.riskLevel).toBe(riskLevel);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('Property 5.5: no matching items are excluded from risk level filter', () => {
            fc.assert(
                fc.property(
                    permissionsArb,
                    riskLevelArb,
                    (permissions, riskLevel) => {
                        const result = filterByRiskLevel(permissions, riskLevel);
                        const expectedCount = permissions.filter(p => p.riskLevel === riskLevel).length;
                        expect(result.length).toBe(expectedCount);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('Property 5.6: null risk level returns all permissions', () => {
            fc.assert(
                fc.property(permissionsArb, (permissions) => {
                    const result = filterByRiskLevel(permissions, null);
                    expect(result.length).toBe(permissions.length);
                }),
                { numRuns: 100 }
            );
        });
    });

    describe('filterByPermissionType', () => {
        it('Property 5.7: all returned items match the permission type filter', () => {
            fc.assert(
                fc.property(
                    permissionsArb,
                    permissionTypeArb,
                    (permissions, permissionType) => {
                        const result = filterByPermissionType(permissions, permissionType);
                        result.forEach(p => {
                            expect(p.permissionType).toBe(permissionType);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('Property 5.8: null permission type returns all permissions', () => {
            fc.assert(
                fc.property(permissionsArb, (permissions) => {
                    const result = filterByPermissionType(permissions, null);
                    expect(result.length).toBe(permissions.length);
                }),
                { numRuns: 100 }
            );
        });
    });

    describe('applyFilters', () => {
        it('Property 5.9: combined filters return intersection of individual filters', () => {
            fc.assert(
                fc.property(
                    permissionsArb,
                    riskLevelArb,
                    permissionTypeArb,
                    (permissions, riskLevel, permissionType) => {
                        const filters: FilterState = {
                            searchQuery: '',
                            riskLevel,
                            permissionType,
                        };

                        const result = applyFilters(permissions, filters);

                        // All results should match both filters
                        result.forEach(p => {
                            expect(p.riskLevel).toBe(riskLevel);
                            expect(p.permissionType).toBe(permissionType);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});

/**
 * **Feature: permitguard, Property 7: Search Filter Idempotence**
 * *For any* search query, applying the same filter twice in succession SHALL produce identical results.
 * **Validates: Requirements 6.2**
 */
describe('Filter Idempotence - Property Tests', () => {
    it('Property 7.1: applying search filter twice produces identical results', () => {
        fc.assert(
            fc.property(
                permissionsArb,
                fc.string({ minLength: 0, maxLength: 20 }),
                (permissions, query) => {
                    const result1 = filterBySearch(permissions, query);
                    const result2 = filterBySearch(result1, query);

                    expect(result2.length).toBe(result1.length);
                    expect(result2.map(p => p.id)).toEqual(result1.map(p => p.id));
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 7.2: applying risk level filter twice produces identical results', () => {
        fc.assert(
            fc.property(
                permissionsArb,
                fc.option(riskLevelArb, { nil: null }),
                (permissions, riskLevel) => {
                    const result1 = filterByRiskLevel(permissions, riskLevel);
                    const result2 = filterByRiskLevel(result1, riskLevel);

                    expect(result2.length).toBe(result1.length);
                }
            ),
            { numRuns: 100 }
        );
    });

    it('Property 7.3: applying combined filters twice produces identical results', () => {
        fc.assert(
            fc.property(
                permissionsArb,
                fc.record({
                    searchQuery: fc.string({ minLength: 0, maxLength: 10 }),
                    riskLevel: fc.option(riskLevelArb, { nil: null }),
                    permissionType: fc.option(permissionTypeArb, { nil: null }),
                }),
                (permissions, filters) => {
                    const result1 = applyFilters(permissions, filters);
                    const result2 = applyFilters(result1, filters);

                    expect(result2.length).toBe(result1.length);
                    expect(result2.map(p => p.id)).toEqual(result1.map(p => p.id));
                }
            ),
            { numRuns: 100 }
        );
    });
});
