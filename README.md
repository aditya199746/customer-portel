
# 💼 Customer Portal

A **cross-platform**, **microfrontend-based** enterprise portal built for banking use cases. Built with **React Native**, **React Native Web**, and **Webpack Module Federation**, it showcases dynamic runtime composition for both Web and Mobile.

---

## 🚀 Features

- 📱 Single Codebase for Web + Mobile using **React Native** and `react-native-web`
- 🧩 Micro-Frontends powered by **Webpack Module Federation**:
  - **MF1**: Account Overview
  - **MF2**: Transaction History & Details
- 🔗 Shared UI Library (`ui-kit`) using React Native primitives
- ⚡ Runtime Composition of MFs via Host (Web + Mobile)
- 🧠 GraphQL Mock Backend using `json-graphql-server`
- 📦 Monorepo using `Turborepo` and `npm workspaces`
- 🔊 Event-driven communication via custom **Event Bus**
- 📱 Host Native App runs inside **Expo Go** using WebView

---

## 📂 Monorepo Structure

```
customer-portal/
├── apps/
│   ├── host-web/              # Web Host Container (MF loader)
│   ├── host-native-viewer/    # Mobile Host (Expo + WebView)
│   ├── mf-account-overview/   # MF1 - Account Overview
│   ├── mf-transaction-history/ # MF2 - Transaction History
│
├── packages/
│   ├── ui-kit/                # Shared UI Components
│   ├── event-bus/             # PubSub for MF communication
│
├── server/                    # json-graphql-server for mock data
├── package.json               # Monorepo workspace config
├── turbo.json                 # Turborepo pipeline config
```

---

## 🛠 Setup Instructions

### 1. 📦 Install & Bootstrap

```bash
git clone <your-repo-url> customer-portal
cd customer-portal
npm install
npm run build --filter=packages/ui-kit
npm run build --filter=packages/event-bus
```

---

### 2. 🔌 Start Mock GraphQL API

```bash
npm run dev:api
```

- Runs on: [http://localhost:4001/graphql](http://localhost:4001/graphql)

---

### 3. 🧩 Start Micro-Frontends

```bash
npm run dev:mf1  # → http://localhost:3001
npm run dev:mf2  # → http://localhost:3002
```

---

### 4. 🖥️ Run Host-Web

```bash
npm run dev:host-web
```

- Runs on: [http://localhost:3000](http://localhost:3000)

---

### 5. 📱 Run Host-Native-Viewer (Expo Mobile)

```bash
npm run dev:host-native-viewer
# OR
cd apps/host-native-viewer
npx expo start
```

> Scan the QR code using **Expo Go** on your mobile.  
> The app will load Host-Web in a WebView and inject props using `window.dispatchEvent(new CustomEvent('ExpoProps'))`.

---

## ⚙️ Architectural Decisions

| Area | Choice | Justification |
|------|--------|----------------|
| Micro Frontends | Webpack Module Federation | Enables independent MFs that can be versioned & deployed separately |
| UI Layer | React Native + react-native-web | Maximum code reuse between platforms |
| State & Data | Apollo Client + GraphQL | Declarative, scalable data fetching |
| Composition | Host-Web & Host-Native (via WebView) | Ensures dynamic MF composition across platforms |
| Event Handling | Event Bus (`pub/sub`) | Loose coupling between MFs (e.g. MF1 → MF2) |
| Mobile Delivery | Expo + WebView | Bypasses Metro’s MF limitations using Host-Web within WebView |

---

## 🧪 Deployment Strategy

### 1. 🎯 Versioning & CDN

| Artifact | Strategy |
|---------|----------|
| `ui-kit`, `event-bus` | Versioned via SemVer, published to private npm registry |
| MF1/MF2 | Build `remoteEntry.js` and deploy to CDN (e.g., S3 + CloudFront) |
| Host-Web | Deploy via Vercel/Netlify, dynamically loads MF from CDN |
| Host-Native | Built using Expo EAS, uses the same CDN-hosted Host-Web |

### 2. 🔁 CI/CD (Suggest Setup)

- **Microfrontends**:
  - Lint + test → Build → Upload `remoteEntry.js` to CDN → Invalidate cache
- **Shared Packages**:
  - Lint + test → Build → Publish to registry
- **Host-Web**:
  - Build → Deploy static assets → Validate MF load
- **Host-Native**:
  - Expo EAS build → Test or store distribution

---

## ⚠️ Known Limitations

- ❌ **True Native MF**: WebView used; direct MF in Metro not yet supported
- 🔒 **Security**: No auth flows (add JWT/OAuth for production)
- 📈 **Performance**: No prefetching or advanced caching
- 🧪 **Testing**: No automated E2E tests yet (recommend: Cypress, Detox)
- ♿ **Accessibility**: Basic UI only; needs WCAG checks & theme support

---

## 🌟 Future Roadmap

- ✅ Migrate from WebView → Native MF (via Re.Pack or native Metro plugin)
- ✅ Add real user auth with token storage and secure APIs
- ✅ Setup advanced CI/CD pipelines (canary, rollback, etc.)
- ✅ Create design system from UI Kit with full theming
- ✅ Add i18n, A11y, Lighthouse & performance budgets

---

## 📹 Demo Video

🖥️ Watch a full 5–10 minute Loom walkthrough covering:

1. Running GraphQL Server + MFs
2. Launching Host-Web with MF1 + MF2 dynamically loaded
3. Mobile: Opening Host-Native-Viewer via Expo Go
4. Injecting props into WebView and triggering MF events
5. Explaining the folder structure and MF design

👉 **Watch here**: [Loom Video URL](https://www.loom.com/share/your-demo-url)

