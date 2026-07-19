# portuguese-bits-server

Portuguese Bits is an app to practice Portuguese vocabulary (or English if you are a Portuguese speaker). Written in English and Portuguese, it uses the flash card method to help memorizing words.

## Table of Contents

- [portuguese-bits-server](#portuguese-bits-server)
  - [Table of Contents](#table-of-contents)
  - [Mockups](#mockups)
  - [Deployments](#deployments)
  - [Built with](#built-with)
  - [Installation](#installation)
  - [Team](#team)
  - [License](#license)

## Mockups

![mockups for Portuguese Bits](./assets/mockups.png)

Flower illustrations by [Flower Club](https://www.pinterest.com/flowerclubco/)

## Deployments

**Web demo (Vercel):** static Expo export (`npx expo export --platform web` → `dist/`).

Set these Production env vars in the Vercel project:

| Variable | Value |
| -------- | ----- |
| `EXPO_PUBLIC_API_URL` | Your API base URL (e.g. `https://portuguese-bits-server.vercel.app`) |
| `EXPO_PUBLIC_DEMO_MODE` | `true` for the public read-only guest demo |

With demo mode on, visitors skip login, can take quizzes and browse vocabulary, but cannot add/edit/delete words, and streaks stay at 0 (no write API calls).

Use Node 24 (see `.nvmrc`). Local full app: keep `EXPO_PUBLIC_DEMO_MODE=false`.

Demo URL: [coming soon](https://...)

## Built with

- Node.js 24
- React Native
- TypeScript

## Installation

```bash
nvm use
npm install
```

## Team

| [![Marina Kinalone Simonnet](https://avatars.githubusercontent.com/u/63544936?v=3&s=144)](https://github.com/marinakinalone) |
| ---------------------------------------------------------------------------------------------------------------------------- |
| [Marina Kinalone Simonnet](https://github.com/marinakinalone)                                                                |

## [License](https://github.com/marinakinalone/portuguese-bits/blob/main/LICENSE.txt)

MIT © [Marina Kinalone Simonnet](https://github.com/marinakinalone)
