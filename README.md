# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎨 Base UI components with CSS Modules
- ✅ Vitest testing infrastructure
- 🌓 Dark mode support
- 📖 [React Router docs](https://reactrouter.com/)
- 📘 [Base UI docs](https://base-ui.com)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To build and deploy directly to production:

```sh
npm run deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## Components & Styling

This template uses [Base UI](https://base-ui.com) with CSS Modules for styling:

- **Base UI**: Unstyled, accessible React components
- **CSS Modules**: Scoped styling with zero runtime overhead
- **Design System**: CSS custom properties in `app/app.css`
- **Dark Mode**: Automatic support via `prefers-color-scheme`

### Available Components

See `app/components/README.md` for full documentation:

- Button, LinkButton, Avatar, Dialog
- Checkbox, Switch, Input, Field, Form
- Toast, Accordion, Select, Menu, Tabs
- And 40+ more components

### Component Usage

```tsx
import { Button, LinkButton, Avatar, Dialog } from "~/components";

// Button
<Button variant="primary" size="md">Click me</Button>

// Link as Button
<LinkButton variant="primary" href="/dashboard">Dashboard</LinkButton>

// Avatar with fallback
<Avatar src={user.avatarUrl} alt={user.name} size="md" />

// Dialog
<Dialog.Root>
  <Dialog.Trigger><Button>Open</Button></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Title</Dialog.Title>
    <Dialog.Description>Description</Dialog.Description>
  </Dialog.Content>
</Dialog.Root>
```

### Architecture

- **Routes** (`app/routes/`) - Data loading only (loaders/actions)
- **Views** (`app/views/`) - All JSX components organized by namespace
- **Layouts** (`app/layouts/`) - App, public, and system layouts
- **Components** (`app/components/`) - Reusable Base UI components

## Testing

Run tests with Vitest:

```bash
# Watch mode
npm test

# Run once
npm run test:run

# UI dashboard
npm run test:ui
```

---

Built with ❤️ using React Router.
