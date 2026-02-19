# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Production Security Setup

### 1) Configure admin identities (required)

Add these variables to your local `.env` and Vercel project environment settings:

- `VITE_ADMIN_EMAILS=admin@yourdomain.com,owner@yourdomain.com`
- `VITE_ADMIN_PHONES=+919876543210,+911234567890`

The app now resolves admin role from Firebase custom claims and these allowlists.

### 2) Deploy Firestore rules

This project now includes `firestore.rules` with least-privilege access for:

- `products` and `services`: public read, admin write
- `orders` and `appointments`: authenticated owner read/create, admin management
- `users`: self-read/update and admin read/manage

Deploy with Firebase CLI:

`firebase deploy --only firestore:rules`

### 3) Checkout auth requirement

Checkout now requires authenticated users. Unauthenticated users are redirected to login and returned back to checkout after successful sign-in.

### 4) Payment-ready order model

Orders now store normalized payment/amount fields:

- `orderStatus` / `status`
- `amounts` (`subtotal`, `shipping`, `tax`, `total`, `currency`)
- `payment` (`method`, `status`, `provider`, `transactionId`, `paidAt`)
- `orderNumber`, `createdAt`, `updatedAt`
