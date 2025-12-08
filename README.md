# MediPraxis Monorepo

Built with a monorepo architecture using Turborepo. This project includes a mobile app, web application, and API backend.

## Project Structure

```
medipraxis-monorepo/
├── apps/
│   ├── api/                   # Backend API (Hono - Cloudflare Workers)
│   ├── mobile-app/            # React Native mobile app (Expo)
│   └── web-app/               # Web application (React + Vite)
└── packages/
    ├── eslint-config/         # Shared ESLint configurations
    └── typescript-config/     # Shared TypeScript configurations
```

## Apps and Packages

### Applications

- **`api`**: Backend API built with Cloudflare Workers
- **`mobile-app`**: Cross-platform mobile application using Expo and React Native
- **`web-app`**: Web frontend built with React and Vite

### Shared Packages

- **`@repo/eslint-config`**: ESLint configurations for consistent code style
- **`@repo/typescript-config`**: TypeScript configurations for type safety

## Tech Stack

- **Turborepo**: Monorepo build system
- **TypeScript**: Static type checking
- **React**: UI framework
- **Expo**: Mobile app development platform
- **Vite**: Fast web build tool
- **Hono**: Lightweight web framework
- **Cloudflare Workers**: Serverless API platform
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn

### Installation

```bash
# Install dependencies
yarn install
```

### Development

```bash
# Run all apps in development mode
yarn dev

# Run specific app
yarn dev --filter=web-app
yarn dev --filter=mobile-app
yarn dev --filter=api
```

### Build

```bash
# Build all apps and packages
yarn build

# Lint all code
yarn lint

# Format code
yarn format

# Type check
yarn check-types
```
