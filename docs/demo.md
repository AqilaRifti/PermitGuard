# MetaMask Permissions Dashboard - Demo Guide

## 🎬 Demo Script (60-90 seconds)

### Opening (0-10s)
> "Ever wonder what permissions your MetaMask wallet has granted? Let me show you."

**Action:** Show the landing page with the hero section and "Connect MetaMask" button.

---

### Connect Wallet (10-20s)
> "One click to connect, and instantly see every dApp that has access to your wallet."

**Action:** 
1. Click "Connect MetaMask"
2. Approve connection in MetaMask popup
3. Watch the dashboard populate with permission cards

---

### Dashboard Overview (20-35s)
> "The stats bar shows your total permissions and risk breakdown at a glance. See that 67% risk score? Let's find out why."

**Action:**
1. Point to the stats bar (total permissions, safe/moderate/dangerous counts)
2. Highlight the overall risk score gauge
3. Scroll through the permission cards

---

### Risk Assessment (35-50s)
> "Each permission is color-coded by risk. Green is safe—just read access. Yellow means write permissions. Red? That's unlimited spending access. Those are the ones to watch."

**Action:**
1. Point to a green "Safe" badge (Etherscan - read only)
2. Point to a yellow "Moderate" badge (OpenSea - write access)
3. Point to a red "Dangerous" badge (Uniswap - unlimited spend)

---

### Search & Filter (50-60s)
> "Got a lot of permissions? Search by name or filter by risk level to find exactly what you're looking for."

**Action:**
1. Type "Uni" in search bar → shows Uniswap
2. Clear search
3. Select "Dangerous" from risk filter → shows only red permissions

---

### Revoke Permission (60-75s)
> "Found something suspicious? One click to revoke. Watch it disappear."

**Action:**
1. Click "Revoke Access" on a dangerous permission
2. Show loading state
3. Watch the card fade out with animation
4. Point to success toast notification

---

### Bulk Revoke (75-85s)
> "Need to clean house? Select multiple permissions and revoke them all at once."

**Action:**
1. Check 2-3 permission checkboxes
2. Show the bulk actions bar appear
3. Click "Revoke Selected"
4. Show summary toast

---

### Closing (85-90s)
> "Your wallet, your permissions, your control. MetaMask Permissions Dashboard."

**Action:** Show the clean dashboard with remaining safe permissions.

---

## 🖼️ Key Screenshots to Capture

### 1. Hero Section (Disconnected)
- Clean landing page
- Gradient background
- Prominent connect button

### 2. Full Dashboard
- Stats bar with all metrics
- Grid of permission cards
- Mix of risk levels visible

### 3. Permission Card Close-up
- Glassmorphism effect
- dApp icon and name
- Risk badge
- Permission details
- Revoke button

### 4. Search & Filter Active
- Search input with query
- Filter dropdowns
- Filtered results

### 5. Bulk Selection
- Multiple cards selected (checkboxes)
- Bulk actions bar visible
- "Revoke Selected" button

### 6. Empty State
- After revoking all permissions
- Friendly illustration
- "No active permissions" message

### 7. Mobile View
- Responsive single-column layout
- Touch-friendly buttons
- Readable on small screens

---

## 🎥 Video Recording Tips

1. **Resolution:** 1920x1080 or higher
2. **Browser:** Chrome with MetaMask installed
3. **Clean browser:** Hide bookmarks bar, use incognito if needed
4. **Smooth scrolling:** Use trackpad for fluid motion
5. **Pause on key moments:** Let viewers absorb the UI
6. **Background music:** Subtle, upbeat, royalty-free

---

## 💬 Talking Points for Live Demo

### If Asked About Security
> "We never store your private keys or seed phrase. All permission data comes directly from MetaMask's API. Revocations are signed transactions you approve."

### If Asked About Token Approvals
> "Great question! This dashboard focuses on MetaMask connection permissions. Token approvals (ERC-20/NFT) are a related but separate concern—that's on our roadmap."

### If Asked About Other Wallets
> "We're starting with MetaMask since it has 30M+ users, but the architecture supports adding other wallets like Coinbase Wallet or Rainbow."

### If Asked About the Tech Stack
> "React with TypeScript, Vite for blazing fast builds, pure CSS with custom properties for theming, Framer Motion for animations, and MetaMask SDK for wallet integration."

---

## ✅ Pre-Demo Checklist

- [ ] MetaMask installed and unlocked
- [ ] Test wallet with demo permissions (or use mock data)
- [ ] Browser zoom at 100%
- [ ] Dev tools closed
- [ ] Screen recording software ready
- [ ] Microphone tested
- [ ] Script practiced 2-3 times
