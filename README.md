# MetaMask Advanced Permissions Dashboard

A modern, professional single-page web application for viewing and managing all MetaMask wallet permissions. Built with React, Vite, and pure CSS featuring a stunning Web3 aesthetic.

![Dashboard Preview](https://via.placeholder.com/800x400?text=MetaMask+Permissions+Dashboard)

## Features

- 🔗 **Wallet Connection** - Connect your MetaMask wallet with one click
- 📊 **Permission Overview** - View all dApps with active permissions
- 🎨 **Glassmorphism UI** - Modern Web3 aesthetic with dark mode
- ⚠️ **Risk Assessment** - Color-coded risk levels (safe/moderate/dangerous)
- 🗑️ **One-Click Revoke** - Revoke individual or bulk permissions
- 🔍 **Search & Filter** - Find permissions by dApp name, risk level, or type
- 📈 **Statistics Dashboard** - Total permissions, risk breakdown, overall score
- 📜 **Permission History** - Timeline of permission events via Envio
- ✨ **Smooth Animations** - Framer Motion powered transitions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **React 18** + **TypeScript** - Type-safe component architecture
- **Vite** - Lightning fast development and builds
- **Pure CSS** - Custom styling with CSS variables and glassmorphism
- **MetaMask SDK** - Official wallet integration
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting utilities
- **fast-check** - Property-based testing

## Getting Started

### Prerequisites

- Node.js 18+
- MetaMask browser extension

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd metamask-permissions-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout/          # Main layout wrapper
│   ├── HeroSection/     # Hero with connect button
│   ├── ConnectButton/   # MetaMask connection
│   ├── StatsBar/        # Statistics display
│   ├── PermissionCard/  # Individual permission card
│   ├── SearchFilter/    # Search and filter controls
│   ├── EmptyState/      # Empty state displays
│   ├── HistoryTimeline/ # Permission history
│   └── Toast/           # Toast notifications
├── hooks/               # Custom React hooks
├── services/            # API services (MetaMask, Envio)
├── context/             # React context providers
├── types/               # TypeScript interfaces
├── utils/               # Utility functions
└── index.css            # Global styles
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

The project includes property-based tests using fast-check to verify:
- Risk level calculation determinism
- Filter result correctness
- Filter idempotence

## Design Principles

- **Dark Mode First** - Purple/blue gradient accents on dark background
- **Glassmorphism** - Frosted glass effect cards with backdrop blur
- **Clear Hierarchy** - Important information stands out
- **Micro-interactions** - Hover effects, smooth transitions
- **Accessibility** - Proper contrast, keyboard navigation

## Environment Variables

No environment variables required for basic functionality. For production Envio integration:

```env
VITE_ENVIO_API_URL=https://api.envio.dev/graphql
```

## Demo Mode

The app includes demo data when no real permissions are found, allowing you to explore the UI without connecting a wallet with active permissions.

## License

MIT
