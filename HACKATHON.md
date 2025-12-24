# 🛡️ PermitGuard

> **Take control of your wallet. See every permission. Revoke with one click.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)

---

## 🎬 Demo

[▶️ Watch Demo Video](#) | [🌐 Live Demo](#)

---

## 📸 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x450/1a1a2e/ffffff?text=Dashboard+Overview)

### Permission Cards with Risk Assessment
![Permission Cards](https://via.placeholder.com/800x450/1a1a2e/ffffff?text=Permission+Cards)

### Mobile Responsive Design
![Mobile View](https://via.placeholder.com/400x700/1a1a2e/ffffff?text=Mobile+View)

---

## 🎯 Problem Statement

Every Web3 user accumulates wallet permissions over time. These permissions:
- 🔴 Often go unnoticed and unmanaged
- 🔴 Create security vulnerabilities
- 🔴 Remain active long after they're needed
- 🔴 Are difficult to find and revoke

**Result:** Millions of wallets have unnecessary exposure to potential exploits.

---

## 💡 Our Solution

A beautiful, functional dashboard that gives users **complete visibility and control** over their MetaMask permissions.

### Key Features

| Feature | Description |
|---------|-------------|
| 🔗 **One-Click Connect** | Seamless MetaMask integration |
| 📊 **Risk Assessment** | Color-coded risk levels (safe/moderate/dangerous) |
| 🗑️ **Easy Revocation** | Single or bulk permission removal |
| 🔍 **Search & Filter** | Find permissions by name, risk, or type |
| 📈 **Statistics** | Overall risk score and permission breakdown |
| 📜 **History Timeline** | Track permission events over time |
| 🌙 **Dark Mode** | Modern Web3 aesthetic |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript |
| Build | Vite |
| Styling | Pure CSS (Glassmorphism, CSS Variables) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Wallet | MetaMask SDK |
| Testing | Vitest, fast-check (Property-Based Testing) |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/permitguard.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/     # React UI components
├── hooks/          # Custom React hooks
├── services/       # MetaMask & API services
├── context/        # React context providers
├── types/          # TypeScript interfaces
├── utils/          # Utility functions
└── index.css       # Global styles
```

---

## 🧪 Testing

We use **property-based testing** to ensure correctness:

```bash
npm test
```

**25 tests** covering:
- ✅ Risk level calculation determinism
- ✅ Filter result correctness
- ✅ Filter idempotence
- ✅ Stats calculation accuracy

---

## 🎨 Design Highlights

### Glassmorphism Cards
Frosted glass effect with backdrop blur for a modern Web3 look.

### Risk Color Coding
- 🟢 **Green (Safe)** - Read-only access
- 🟡 **Yellow (Moderate)** - Write access with limits
- 🔴 **Red (Dangerous)** - Unlimited spending access

### Smooth Animations
Framer Motion powered transitions for a polished feel.

---

## 🔮 Roadmap

- [x] Core dashboard functionality
- [x] Risk assessment system
- [x] Search and filter
- [x] Bulk revocation
- [ ] Real-time permission alerts
- [ ] Cross-chain support
- [ ] Browser extension
- [ ] Mobile app

---

## 👥 Team

Built with ❤️ for the Web3 community.

---

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

## 🙏 Acknowledgments

- MetaMask team for the SDK
- The Web3 security community
- All the dApps that inspired better permission management

---

<div align="center">

**⭐ Star this repo if you found it useful!**

[Report Bug](#) · [Request Feature](#) · [Documentation](./docs/)

</div>
