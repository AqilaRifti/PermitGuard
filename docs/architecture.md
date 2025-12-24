# PermitGuard - Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Application                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │   UI Layer  │  │ Hook Layer  │  │Service Layer│       │  │
│  │  │ Components  │◄─┤   Hooks     │◄─┤  Services   │       │  │
│  │  └─────────────┘  └─────────────┘  └──────┬──────┘       │  │
│  │                                           │               │  │
│  └───────────────────────────────────────────┼───────────────┘  │
│                                              │                   │
│  ┌───────────────────────────────────────────▼───────────────┐  │
│  │                   MetaMask Extension                       │  │
│  │              (window.ethereum provider)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Blockchain    │
                    │   (Ethereum)    │
                    └─────────────────┘
```

---

## 📁 Project Structure

```
src/
├── components/           # React UI components
│   ├── Layout/          # Main layout wrapper
│   ├── HeroSection/     # Hero with connect button
│   ├── ConnectButton/   # MetaMask connection
│   ├── StatsBar/        # Statistics display
│   ├── PermissionCard/  # Individual permission card
│   ├── SearchFilter/    # Search and filter controls
│   ├── BulkActions/     # Bulk selection actions
│   ├── EmptyState/      # Empty state displays
│   ├── HistoryTimeline/ # Permission history
│   ├── RiskBadge/       # Risk level indicator
│   ├── SkeletonCard/    # Loading placeholder
│   └── Toast/           # Toast notifications
│
├── hooks/               # Custom React hooks
│   ├── usePermissions   # Permission fetching & revocation
│   ├── useHistory       # Permission event history
│   ├── useFilters       # Search & filter state
│   ├── useStats         # Dashboard statistics
│   └── useToasts        # Toast notification state
│
├── services/            # External service integrations
│   ├── metamask.service # MetaMask SDK wrapper
│   ├── envio.service    # Envio indexer (mock)
│   └── toast.service    # Toast management
│
├── context/             # React context providers
│   └── WalletContext    # Wallet connection state
│
├── types/               # TypeScript interfaces
│   ├── permission.ts    # Permission types
│   ├── wallet.ts        # Wallet state types
│   ├── history.ts       # History event types
│   └── ui.ts            # UI state types
│
├── utils/               # Utility functions
│   ├── risk.ts          # Risk calculation
│   └── filter.ts        # Filter logic
│
└── index.css            # Global styles & CSS variables
```

---

## 🔄 Data Flow

### 1. Wallet Connection Flow

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
│ MetaMaskService   │
│ eth_requestAccounts│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ MetaMask Popup    │
│ User approves     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ WalletContext     │
│ state updated     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Dashboard renders │
│ with permissions  │
└───────────────────┘
```

### 2. Permission Fetching Flow

```
Wallet connected
        │
        ▼
┌───────────────────┐
│ usePermissions    │
│ useEffect trigger │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ MetaMaskService   │
│ wallet_getPermissions│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Transform raw     │
│ permissions       │
│ + calculate risk  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Permission[]      │
│ state updated     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ PermissionCard    │
│ components render │
└───────────────────┘
```

### 3. Revocation Flow

```
User clicks "Revoke"
        │
        ▼
┌───────────────────┐
│ PermissionCard    │
│ onRevoke callback │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ usePermissions    │
│ revokePermission()│
└────────┬──────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ Set revoking    │  │ MetaMaskService │
│ state (loading) │  │ revoke call     │
└─────────────────┘  └────────┬────────┘
                              │
                     ┌────────┴────────┐
                     │                 │
                     ▼                 ▼
              ┌──────────┐      ┌──────────┐
              │ Success  │      │ Failure  │
              └────┬─────┘      └────┬─────┘
                   │                 │
                   ▼                 ▼
            ┌────────────┐    ┌────────────┐
            │ Remove from│    │ Restore    │
            │ state      │    │ state      │
            └────────────┘    └────────────┘
                   │                 │
                   ▼                 ▼
            ┌────────────┐    ┌────────────┐
            │ Success    │    │ Error      │
            │ toast      │    │ toast      │
            └────────────┘    └────────────┘
```

---

## 🎨 Component Architecture

### Component Hierarchy

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

## 🔧 Key Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| UI Framework | React 19 | Component-based UI |
| Language | TypeScript | Type safety |
| Build Tool | Vite | Fast dev/build |
| Styling | Pure CSS | Custom design system |
| Animations | Framer Motion | Smooth transitions |
| Icons | Lucide React | Consistent iconography |
| Wallet | MetaMask SDK | Wallet integration |
| Testing | Vitest + fast-check | Unit & property tests |
| Dates | date-fns | Date formatting |

---

## 🎯 Design Patterns

### 1. Service Layer Pattern
Services abstract external APIs (MetaMask, Envio) from React components.

```typescript
// Service interface
interface IMetaMaskService {
  connect(): Promise<string>;
  getPermissions(): Promise<Permission[]>;
  revokePermission(id: string): Promise<void>;
}

// Implementation
class MetaMaskService implements IMetaMaskService {
  // ... implementation
}

// Singleton export
export const metamaskService = new MetaMaskService();
```

### 2. Custom Hook Pattern
Hooks encapsulate stateful logic and side effects.

```typescript
function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch, revoke, etc.
  
  return { permissions, isLoading, revokePermission };
}
```

### 3. Context Provider Pattern
Global state shared via React Context.

```typescript
const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }) {
  const [state, setState] = useState(initialState);
  // ...
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
```

### 4. CSS Custom Properties
Theming via CSS variables for consistency.

```css
:root {
  --color-safe: #10b981;
  --color-moderate: #f59e0b;
  --color-dangerous: #ef4444;
  --color-bg-card: rgba(255, 255, 255, 0.03);
}
```

---

## 🧪 Testing Strategy

### Unit Tests
- Risk calculation functions
- Filter utility functions
- Component rendering

### Property-Based Tests
- Risk level determinism
- Filter correctness
- Filter idempotence

```typescript
// Example property test
fc.assert(
  fc.property(accessLevelArb, spendLimitArb, (access, limit) => {
    const result1 = calculateRiskLevel(access, limit);
    const result2 = calculateRiskLevel(access, limit);
    expect(result1).toBe(result2); // Deterministic
  })
);
```

---

## 🔒 Security Considerations

1. **No Private Keys** - Never access or store private keys
2. **Read-Only by Default** - Only request necessary permissions
3. **User Confirmation** - All revocations require user approval
4. **No Backend** - Fully client-side, no data leaves the browser
5. **Open Source** - Code is auditable

---

## 🚀 Performance Optimizations

1. **Lazy Loading** - Components load on demand
2. **Memoization** - `useMemo` for expensive calculations
3. **Virtualization Ready** - Grid can be virtualized for large lists
4. **Optimistic Updates** - UI updates before confirmation
5. **Skeleton Loading** - Perceived performance improvement
