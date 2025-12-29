# React Router + Cloudflare Workers Boilerplate

A modern, production-ready template for building full-stack React applications with multi-provider OAuth, email/password authentication, workspace management, and invitation system.

## 🚀 Setup from Template

### Quick Start

```bash
# Using GitHub CLI
gh repo create your-app-name --template getnvoi/react-router-workers-boilerplate --public
cd your-app-name

# Run setup script
./setup.sh your-app-name

# Install and start
npm install
npm run dev
```

### Environment Setup

1. **Create D1 Databases:**

   ```bash
   wrangler d1 create your-app-name_production
   wrangler d1 create your-app-name_development
   ```

2. **Copy database IDs to `wrangler.jsonc`**

3. **Setup environment variables:**

   ```bash
   cp .dev.vars.example .dev.vars
   ```

4. **Edit `.dev.vars` with your credentials:**

   ```env
   # OAuth Providers (optional - use any combination)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your_auth0_client_id
   AUTH0_CLIENT_SECRET=your_auth0_client_secret

   # Email Service (required for invites)
   POSTMARK_API_KEY=your_postmark_api_key

   # Session Secret
   SESSION_SECRET=your-random-secret-key
   ```

5. **Run migrations:**

   ```bash
   npm run db:migrate:local
   ```

6. **Start development:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication

### Multi-Provider OAuth

Supports GitHub, Google, and Auth0 out of the box. Configure providers in `.dev.vars` and users can sign in with any configured provider.

### Email/Password Authentication

Users can also sign up and login with email/password:

- **Password requirements**: Minimum 12 characters (bcrypt with 12 rounds)
- **Routes**: `/auth/register` and `/auth/login`
- **Auto-workspace creation**: Default workspace created on signup

### System Users

Separate `system_users` table for admin/internal users (email/password only).

## 👥 Workspace & Invitations

### Workspace System

- **Multi-tenant**: Users can belong to multiple workspaces
- **Auto-provisioning**: Default workspace created on first login/signup
- **Role-based**: Members and Admins

### Invitation Flow

1. **Send Invite**: User invites someone by email (`/app/workspace/invites`)
2. **Email Sent**: Postmark sends branded invitation email
3. **Accept Invite**: Recipient clicks link `/invite/{token}`
   - If no account: Sign up (OAuth or email/password)
   - If has account: Login and accept
4. **Email Verification**: Must login with matching email
5. **Auto-join**: Added to workspace_users on acceptance

**Security:**

- Invite tokens: UUID v4, one-time use
- Expiry: 7 days
- Email verification: Blocks wrong account acceptance
- Status tracking: pending/accepted/declined/expired

## 📧 Email Configuration (Postmark)

1. **Sign up**: https://postmarkapp.com
2. **Get API key**: From account settings
3. **Configure sender**: Add verified sender email (e.g., `invites@yourdomain.com`)
4. **Add to `.dev.vars`**:
   ```env
   POSTMARK_API_KEY=your-api-key
   ```

**Email service** (`app/services/email.server.ts`):

- Sends workspace invitation emails
- HTML and plain text versions
- Customizable templates

## 📁 Project Structure

```
app/
├── components/       # Base UI components (40+ components)
├── routes/          # React Router routes (loaders/actions only)
├── views/           # Presentational components (organized by feature)
├── layouts/         # App, public, and system layouts
├── services/        # Business logic
│   ├── auth.server.ts
│   ├── auth-email.server.ts
│   ├── workspace.server.ts
│   ├── workspace-invite.server.ts
│   └── email.server.ts
├── db/              # Database schema and utilities
└── tests/           # Vitest tests
```

## 🎨 Components & Styling

Built with [Base UI](https://base-ui.com) and CSS Modules:

- **40+ Components**: Button, Dialog, Form, Field, Combobox, Select, Menu, etc.
- **CSS Modules**: Scoped styling with zero runtime overhead
- **Design System**: CSS custom properties in `app/app.css`
- **Dark Mode**: Automatic via `prefers-color-scheme`
- **Lucide Icons**: Modern icon library

### Component Patterns

- **Props mode**: AlertDialog, Dialog, Slider (simple API)
- **Compound mode**: Field, Form, Fieldset, Accordion (flexible composition)
- **Dual mode**: RadioGroup (options array OR children)

See `app/components/README.md` for full documentation.

## 🗄️ Database

**Stack**: Drizzle ORM + Cloudflare D1 (SQLite)

**Tables:**

- `users` - OAuth and email/password users
- `system_users` - Admin/internal users
- `workspaces` - Multi-tenant workspaces
- `workspace_users` - User-workspace relationships
- `workspace_invites` - Invitation system
- `jobs` - Background job queue

**Migrations:**

```bash
# Generate migration
npm run db:generate

# Apply locally
npm run db:migrate:local

# Apply to production
npm run db:migrate:prod
```

## ✅ Testing

**Test Infrastructure:**

- Miniflare for isolated D1 testing
- Vitest with React Testing Library
- 40 tests across auth, workspaces, and invites

**Commands:**

```bash
npm test              # Run once (CI mode)
npm run test:watch    # Watch mode
npm run test:ui       # UI dashboard
```

**Test helpers** (`app/tests/helpers/miniflare.ts`):

- Shared Miniflare instance
- Test DB initialization
- Truncate/cleanup utilities
- Reusable across all tests

## 🔧 Development

**Scripts:**

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run deploy        # Build and deploy to Cloudflare
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix lint issues
npm run typecheck     # TypeScript type checking
npm test              # Run tests
```

**ESLint Configuration:**

- Enforces `import type` for TypeScript types
- Strict no-unused-vars (no exceptions)
- All Cloudflare Workers globals defined

## 📦 Key Features

✅ Multi-provider OAuth (GitHub, Google, Auth0)
✅ Email/password authentication
✅ Multi-tenant workspace system
✅ Invitation system with email notifications
✅ 40+ Base UI components
✅ Comprehensive test coverage
✅ Type-safe with TypeScript
✅ ESLint with strict rules
✅ Cloudflare Workers deployment

## 🚢 Deployment

```bash
# Deploy to production
npm run deploy

# Or use Wrangler versions for gradual rollout
npx wrangler versions upload
npx wrangler versions deploy
```

## 📚 Documentation

- [React Router docs](https://reactrouter.com/)
- [Base UI docs](https://base-ui.com)
- [Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
- [Drizzle ORM docs](https://orm.drizzle.team/)

---

Built with ❤️ using React Router, Base UI, and Cloudflare Workers.
