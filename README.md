# VapeFree

VapeFree is a vaping cessation mobile app built for an MSc dissertation project. It combines adaptive onboarding, offline-first tracking, an AI support chatbot (via Firebase Cloud Functions and Google Gemini), and WCAG 2.1 AA accessible UI.

## Stack

- React Native with Expo (managed workflow), TypeScript, Expo Router
- NativeWind (Tailwind CSS for React Native)
- Firebase Authentication, Firestore, Cloud Functions, Analytics
- Jest and React Native Testing Library for unit and integration tests
- Maestro or Detox for end-to-end tests (to be added)

## Prerequisites

- Node.js 20.18.3 (see `.nvmrc`)
- npm 10+
- Java 11+ (required for Firestore emulator)
- Expo Go on a physical device, or Xcode / Android Studio for simulators

## Setup (no billing required)

You can develop locally with the **Firebase Emulator Suite** on the free Spark plan. No credit card is needed.

1. Clone the repository:

```bash
git clone https://github.com/Goutamchandnani/VapeFree.git
cd VapeFree
```

2. Use the pinned Node version:

```bash
nvm use
```

3. Install dependencies:

```bash
npm install
npm install --prefix functions
```

4. Copy environment variables (emulators enabled by default):

```bash
cp .env.example .env
```

5. Start everything with one command (recommended):

```bash
npm run dev
```

This launches Firebase emulators, waits until Auth/Firestore/Functions are listening, then starts Expo with `--lan --clear` for phone testing.

**Or** run them separately in two terminals:

```bash
npm run emulators   # terminal 1
npm start           # terminal 2 (LAN + cleared Metro cache)
```

Open the Emulator UI at [http://localhost:4000](http://localhost:4000).

### Physical device testing

Set your computer LAN IP in `.env`:

```bash
EXPO_PUBLIC_FIREBASE_EMULATOR_HOST=192.168.1.10
```

## Production Firebase (Spark, still free)

When the Firebase Console project is fully active, set `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=false` and add web app keys to `.env`. Auth and Firestore remain free within Spark quotas. Cloud Functions deployment requires Blaze, but emulator development does not.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start emulators + Expo together (recommended) |
| `npm start` | Start Expo on LAN with cleared Metro cache |
| `npm run start:local` | Start Expo without LAN/clear flags |
| `npm run ios` | Open iOS simulator |
| `npm run android` | Open Android emulator |
| `npm test` | Run Jest unit and integration tests |
| `npm run test:e2e` | Run Maestro end-to-end flows |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run lint` | Run ESLint (zero warnings required) |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript strict check |
| `npm run emulators` | Start Auth, Firestore, and Functions emulators |
| `npm run emulators:clear` | Start emulators without persisted data |
| `npm run build:apk` | EAS cloud build: Android APK (preview profile) |

## Standalone Android APK (EAS)

Use this when you want an installable APK without Expo Go or Metro on the phone.

1. Log in once: `npx eas login`
2. Build in the cloud (free tier): `npm run build:apk`
3. When prompted the first time, choose **Yes** to generate an Android keystore (Expo stores it for future builds).
4. Open the build URL from the terminal and download the **APK** when the job finishes.
5. On your phone, allow installs from unknown sources and open the APK.

**Firebase in the APK:** EAS does not upload your local `.env`. Either:

- Add **Environment variables** in [expo.dev](https://expo.dev) → VapeFree → Environment variables (`EXPO_PUBLIC_FIREBASE_*`, `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=false`), then rebuild, **or**
- For a LAN demo with emulators on your Mac: set `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true` and `EXPO_PUBLIC_FIREBASE_EMULATOR_HOST=<your Mac LAN IP>` on the **preview** profile in EAS, with emulators running while you test.

The app still opens if Firebase is missing (banner + offline support chat). Sign-in and cloud sync need valid config.

If EAS build fails or is not worth the setup, **Expo Go + `npm start`** remains the supported dev path.

## Troubleshooting

### Metro crashes when saving Tailwind classes (`addedFiles`)

Upgraded **NativeWind 4.2.6** includes the Metro 0.83+ hot-reload fix. If Metro still misbehaves, restart with a cleared cache:

```bash
npm start
```

(`npm start` already passes `--lan --clear`.)

### Emulators not running

If sign-in, chat, or Firestore writes fail, ensure emulators are up. Use `npm run dev` or `npm run emulators` in a separate terminal. Check the Emulator UI at [http://localhost:4000](http://localhost:4000).

## Architecture

### Offline-first data

Firestore is initialised with a persistent local cache. User actions write locally first and sync when connectivity returns. Firebase Auth persists across cold starts using AsyncStorage.

### AI chatbot safety

The client never calls Gemini directly. All model requests go through Cloud Functions in `functions/`, where crisis and medical advice detection run server-side. Chat exchanges are logged to Firestore for researcher review.

### Pseudonymised research data

Identity mapping lives in `researchProfiles/{participantId}` (server-written only). Behavioural data stays under `users/{uid}` subcollections. On first sign-in, the `ensureResearchProfileCallable` Cloud Function assigns a participant id (e.g. `P-0001`) and stores the auth UID mapping separately for GDPR-aligned exports.

### Report inappropriate AI responses

Assistant messages include a **Report response** action. Reports are written server-side via the `reportChatMessage` Cloud Function (`isReported`, `reportReason` on `chatMessages` documents) for researcher review. Clients cannot write chat messages directly.

### Folder structure

```
app/                 Expo Router screens
components/ui/       Reusable accessible UI primitives
constants/           Theme tokens and named constants
hooks/               React hooks
lib/                 Pure business logic (unit tested)
types/               Shared TypeScript contracts
functions/           Firebase Cloud Functions (Gemini proxy)
docs/wireframes/     Google Stitch exports
```

## Testing

Unit and integration tests live in `lib/__tests__/` and `components/**/__tests__/`.

```bash
npm test
npm run test:coverage
```

### End-to-end tests (Maestro)

Maestro flows live in `.maestro/flows/`. Install the [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro), start Metro and Firebase emulators, open the app in Expo Go, then run:

```bash
npm run test:e2e
```

Flows use `host.exp.exponent` (Expo Go). Override with `MAESTRO_APP_ID` when using an EAS development build.

### Firebase Analytics

Analytics events are recorded via `lib/analytics-service.ts`. On web they send to Firebase Analytics when `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` is set. On native builds, events are logged in development and can be wired to `@react-native-firebase/analytics` in production EAS builds.

Key events: `screen_view`, `puff_logged`, `craving_logged`, `chat_message_sent`, `chat_message_reported`, `journal_entry_created`, `onboarding_completed`.

## Firebase

Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Cloud Functions environment variables are documented in `functions/.env.example`. Gemini API keys must remain server-side only.

## Accessibility

The app targets WCAG 2.1 Level AA:

- 44x44pt minimum touch targets
- 4.5:1 text contrast via design tokens in `constants/theme.ts`
- `accessibilityRole` and `accessibilityLabel` on interactive elements
- Layouts avoid fixed text heights for 200% font scaling

## Wireframes

Stitch wireframes are kept in `docs/wireframes/` for reference during screen implementation.

## Distribution

Target channels:

- iOS: TestFlight
- Android: Google Play Internal Testing or internal APK via EAS (`npm run build:apk`)

EAS project id is in `app.json` under `expo.extra.eas.projectId`. Preview builds produce an APK; production profile builds an App Bundle for Play Store.

## Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add craving log form
fix: handle offline sync retry
test: cover reduction cap edge cases
```

## Licence

Academic dissertation project. All rights reserved unless stated otherwise by the author.
