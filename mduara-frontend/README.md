# M-Duara Frontend

M-Duara is a React Native + Expo frontend for goal-based Chama saving, multi-Chama membership, role-scoped official workspaces, public Chama discovery, contribution/loan views, and platform administration.

## Technology

- Expo SDK 52
- React 18
- React Native 0.76
- React Native Web
- TypeScript
- lucide-react-native
- react-native-toast-message

## Requirements

- Node.js 18+ (Node 20 LTS recommended)
- npm
- Git
- VS Code
- Expo Go for physical-device testing, or Android Studio for an emulator

## Install

From the repository root:

```bat
npm install
```

## Run

Web:

```bat
npm run web
```

Expo development server:

```bat
npm start
```

Android:

```bat
npm run android
```

iOS (macOS only):

```bat
npm run ios
```

## Type-check

```bat
npm run typecheck
```

The type-check command runs TypeScript with `noEmit`, so it validates the project without generating build output.

## Recommended clean verification

When validating a fresh checkout on Windows Command Prompt:

```bat
git status
npm install
npm run typecheck
npm run web
```

If Expo cache causes stale UI:

```bat
npx expo start --clear
```

## Product architecture

The authenticated app uses a role-aware navigation shell with a selected Chama context and selected workspace context. A member can belong to multiple Chamas. Official roles such as Secretary, Treasurer and Chairperson are scoped to the active Chama and do not require a second login.

Key areas under `src/` include:

- `app/` — providers, navigation and authenticated/guest app entry
- `features/landing/` — public landing, goal marketplace, matching and Chama detail
- `features/product/` — multi-Chama dashboard, official workspace and trust UI
- `features/chama/` — Chama management and public Chama card components
- `features/contribution/` — member contribution and Treasurer reconciliation views
- `features/loan/` — member and portfolio loan views
- `features/communication/` — Secretary register, applications and communication workspace
- `features/admin/` — Super Admin dashboard, users, Chamas, payments, health and audit views
- `shared/` — reusable mock/prototype data contracts and utilities
- `theme/` — colors, spacing, typography and brand tokens

## Prototype and backend boundaries

The current frontend deliberately distinguishes prototype behavior from production-authoritative actions.

Prototype/local-session behavior currently includes selected demonstration data, goal marketplace aggregates, trust-score examples, merchant/reward examples, announcement drafts and selected operational snapshots.

Backend-authoritative actions must not be simulated as successful when the API contract is not connected. Examples include real payment settlement/reversal, membership approval, reward eligibility/redemption, production trust-score calculation, system-service mutations and audited administrative status changes.

Where those actions are not connected, the UI is intentionally read-only, disabled, or explicitly labeled as prototype/pending instead of pretending that the operation succeeded.

## Goal journey

The public flow follows this sequence:

1. Landing page
2. Goal marketplace
3. Select saving goal
4. Enter savings-plan inputs
5. Review compatible Chamas
6. Open the same canonical Chama detail view
7. Review rules, officials, Constitution and recruitment state
8. Sign in or create an account where required

## Navigation and role safety

The app derives an allowed route set from the active workspace role. When the user changes Chama or workspace, the current route is synchronously resolved to an allowed fallback if necessary, preventing a restricted screen from briefly rendering after a context change.

## Development rules

- Do not expose another member's raw balances or private payment history in shared member views.
- Do not create a second source of truth for goal/marketplace prototype data.
- Do not make a visible control look active unless it performs a real frontend action or is clearly disabled/pending.
- Do not claim a payment, approval, trust score, reward or administrative mutation is production-confirmed unless the corresponding backend service confirms it.
- Keep public Chama trust signals separate from private member trust information.

## Current verification status

Source files changed during the current frontend alignment pass have been syntax/transpile checked individually. A final repository-wide validation should still be run from a complete local checkout with dependencies installed:

```bat
npm install
npm run typecheck
npm run web
```

Do not consider the frontend release-ready until the repository-wide type-check and an actual Expo web/device smoke test both pass.
