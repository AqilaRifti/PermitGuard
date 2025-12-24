# Architecture Documentation

## System Overview

The MetaMask Permissions Dashboard is a single-page React application that provides users with visibility and control over their wallet permissions.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Application                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │   Context   │  │    Hooks    │  │  Components │       │  │
│  │  │  (Wallet)   │◄─┤ (Business)  │◄─┤    (UI)     │       │  │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────┘       │  │
│  │         │                │                                 │  │
│  │         ▼                ▼                                 │  │
│  │  ┌─────────────────────────────────────┐                  │  │
│  │  │           Service Layer              │                  │  │
│  │  │  ┌──────────┐  ┌──────────┐         │                  │  │
│  │  │  │ MetaMask │  │  Toast   │         │                  │  │
│  │  │  │ Service  │  │ Service  │         │                  │  │
│  │  │  └────┬─────┘  └──────────┘         │                  │  │
│  │  └───────┼─────────────────────────────┘                  │  │
│  └──────────┼────────────────────────────────────────────────┘  │
│             │                                                    │
│             ▼                                                    │
│  ┌─────────────────────┐                                        │
│  │   MetaMask Wallet   │                                        │
│  │   (Browser Ext.)    │                                        │
│  └─────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer Architecture

### 1. UI Layer (Components)

Pure presentational components with minimal logic.

```
src/components/
├── Layout/              # Main layout wrapper
├── HeroSection/         # Hero with connect button
├── ConnectButton/       # MetaMask connection UI
├── StatsBar/            # Statistics display
├── PermissionCard/      # Individual permission card
├── SkeletonCard/        # Loading placeholder
├── SearchFilter/        # Search and filter controls
├── BulkActions/         # Bulk selection actions
├── EmptyState/          # Empty state displays
├── HistoryTimeline/     # Permission history
├── RiskBadge/           # Risk level indicator
└── Toast/               # Toast notifications
```

### 2. Hook Layer (Business Logic)

Custom hooks encapsulating business logic and state management.

```
src/hooks/
├── usePermissions.ts    # Permission CRUD operations
├── useHistory.ts        # Permission event history
├── useFilters.ts        # Search and filter state
├── useStats.ts          # Statistics calculations
└── useToasts.ts         # Toast notification state
```

### 3. Context Layer (Global State)

React Context for cross-cutting concerns.

```
src/context/
└── WalletContext.tsx    # Wallet connection state
```

### 4. Service Layer (External APIs)

Abstraction over external services.

```
src/services/
├── metamask.service.ts  # MetaMask SDK integration
├── envio.service.ts     # History data (mock)
└── toast.service.ts     # Toast management
```

### 5. Utility Layer (Pure Functions)

Stateless utility functions.

```
src/utils/
├── risk.ts              # Risk level calculations
└── filter.ts            # Filter logic
```

---

## Data Flow

### Wallet Connection Flow

```
User clicks "Connect"
        │
        ▼
┌───────────────────┐
│  ConnectButton    │
│  onClick handler  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  useWallet hook   │
│  connect()        │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  MetaMask Service │
│  eth_requestAccounts│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  MetaMask Wallet  │
│  User approves    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Context updates  │
│  isConnected=true │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Dashboard loads  │
│  Permissions fetch│
└───────────────────┘
```

### Permission Revocation Flow

```
User clicks "Revoke"
        │
        ▼
┌───────────────────┐
│  PermissionCard   │
│  onRevoke(id)     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  usePermissions   │
│  revokePermission │
└────────┬──────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ Set revoking    │  │ MetaMask Service│
│ state (UI)      │  │ revokePermission│
└─────────────────┘  └────────┬────────┘
                              │
                     ┌────────┴────────┐
                     │                 │
                     ▼                 ▼
              ┌──────────┐      ┌──────────┐
              │ Success  │      │  Error   │
              └────┬─────┘      └────┬─────┘
                   │                 │
                   ▼                 ▼
            ┌────────────┐    ┌────────────┐
            │Remove from │    │Restore card│
            │permissions │    │Show error  │
            │Show toast  │    │toast       │
            └────────────┘    └────────────┘
```

---

## State Management

### Global State (Context)

```typescript
interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  error: string | null;
}
```

### Local State (Hooks)

Each feature hook manages its own state:

```typescript
// usePermissions
permissions: Permission[]
isLoading: boolean
revokingIds: Set<string>

// useFilters
filters: FilterState
hasFilters: boolean

// useStats
stats: DashboardStats
```

### Derived State

Computed from base state:

```typescript
// Filtered permissions
const filteredPermissions = applyFilters(permissions, filters);

// Risk counts
const counts = countByRiskLevel(permissions);

// Overall risk score
const score = calculateOverallRiskScore(permissions);
```

---

## Component Hierarchy

```
App
└── WalletProvider
    └── Dashboard
        ├── Layout
        │   ├── HeroSection
        │   │   ├── ConnectButton (if disconnected)
        │   │   └── WalletInfo (if connected)
        │   │
        │   ├── StatsBar
        │   │   └── StatCard (×5)
        │   │
        │   ├── PermissionsDashboard
        │   │   ├── SearchFilter
        │   │   ├── BulkActions
        │   │   ├── PermissionGrid
        │   │   │   └── PermissionCard (×n)
        │   │   │       ├── RiskBadge
        │   │   │       └── RevokeButton
        │   │   └── EmptyState
        │   │
        │   └── HistoryTimeline
        │       └── HistoryEvent (×n)
        │
        └── ToastContainer
            └── Toast (×n)
```

---

## Key Design Decisions

### 1. Pure CSS over Tailwind

**Decision:** Use custom CSS with CSS variables instead of Tailwind.

**Rationale:**
- Full control over styling
- No build-time dependencies
- Smaller bundle size
- Easier to customize glassmorphism effects

### 2. Service Layer Abstraction

**Decision:** Abstract MetaMask SDK behind a service interface.

**Rationale:**
- Easier testing (mock the service)
- Swap implementations without changing hooks
- Centralized error handling
- Demo mode support

### 3. Property-Based Testing

**Decision:** Use fast-check for core logic testing.

**Rationale:**
- Catches edge cases unit tests miss
- Proves correctness properties
- Documents expected behavior
- Higher confidence in risk calculations

### 4. Demo Data Fallback

**Decision:** Return demo permissions when real data unavailable.

**Rationale:**
- Portfolio showcase works without MetaMask
- Demonstrates full UI capabilities
- Better developer experience
- Judges can evaluate without setup

---

## File Structure

```
src/
├── components/          # React components
│   └── [Component]/
│       ├── index.ts     # Export
│       ├── [Component].tsx
│       └── [Component].css
│
├── hooks/               # Custom React hooks
│   ├── index.ts
│   └── use[Hook].ts
│
├── services/            # External service integrations
│   ├── index.ts
│   └── [service].service.ts
│
├── context/             # React context providers
│   └── [Context]Context.tsx
│
├── types/               # TypeScript interfaces
│   ├── index.ts
│   └── [domain].ts
│
├── utils/               # Pure utility functions
│   ├── index.ts
│   ├── [util].ts
│   └── [util].test.ts
│
├── test/                # Test setup
│   └── setup.ts
│
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

## Performance Considerations

### Bundle Size
- No heavy UI framework (no Tailwind, no Material UI)
- Tree-shakeable imports from lucide-react
- Framer Motion only for essential animations

### Rendering
- Memoized filtered permissions
- Staggered card animations (not all at once)
- Skeleton loaders prevent layout shift

### Network
- Demo data eliminates network dependency
- Graceful degradation if services fail
- Local storage for filter preferences

---

## Security Considerations

### No Private Keys
- Never access or store private keys
- Only read public permission data
- Revocation happens through MetaMask

### Input Validation
- All user inputs sanitized
- URL parsing in try/catch
- Type-safe throughout

### Error Handling
- Errors don't expose internals
- Graceful fallbacks everywhere
- User-friendly error messages
