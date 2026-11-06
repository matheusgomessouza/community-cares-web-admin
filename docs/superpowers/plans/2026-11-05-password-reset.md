# Password reset implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an admin user request a password reset link by e-mail, validate the link, and set a new password.

**Architecture:** The admin frontend adds two public pages. The Express backend adds three public endpoints under `/admin-users/password-reset`. A random token is sent by e-mail. Only its SHA-256 hash is stored in PostgreSQL. A conditional update inside a transaction guarantees single use.

**Tech Stack:** Next.js 14 App Router, React Hook Form, Zod, TanStack Query, Jest, Express, Prisma 5, PostgreSQL, Vitest, Supertest, Argon2.

**Spec:** This plan. The repositories are `~/repos/community-cares-web-admin` (frontend) and `~/repos/community-cares-server` (backend).

## Global Constraints

- Backend base branch: `develop`. Frontend base branch: `origin/master`.
- Backend port is fixed at `8088` in `api/index.ts:137`.
- API base URL comes from `NEXT_PUBLIC_API`.
- Token TTL is 30 minutes by default. Password minimum is 8 characters and maximum is 128.
- Store only the SHA-256 hash of the reset token. Never store or log the raw token.
- The request endpoint always returns the same `202` response for existing, unknown, and duplicated e-mail addresses.
- Never run `typecheck` or `tsgo`. Run tests, lint, and prettier only.
- Do not open a pull request or an issue without explicit consent.
- UI copy stays in English, consistent with the current screens.

## Review Focus

- A duplicated `AdminUser.email` must not send a reset link to the wrong account. Fail closed.
- A used or expired token must never update a password, including under two simultaneous requests.
- A mail transport failure must not leak whether the account exists.
- A token must not appear in logs, in the database, or in a JSON response.
- The reset page must not send the token in the `Referer` header.

---

## Current behavior (verified)

- Login calls `POST /admin-users/authenticate` (`src/components/SignInFormComponent/SignInFormComponent.tsx:23-32`).
- The access token is stored in a JavaScript-readable cookie (`SignInFormComponent.tsx:35`).
- The "Forgot password?" link points to `#` (`SignInFormComponent.tsx:87-89`).
- The backend issues a 15-minute access token and a 30-day refresh token (`api/services/auth-tokens.ts:5-35`).
- Refresh tokens live in an in-memory `Map` (`api/repositories/refresh-tokens-repository.ts:8`).
- `AdminUser.email` is not unique (`prisma/schema.prisma:43`).
- No password reset code, mail transport, or token model exists.

---

## Task 1: Data model, token helper, and repository

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_add_admin_password_reset/migration.sql`
- Create: `api/lib/reset-token.ts`
- Create: `api/repositories/admin-password-reset-tokens-repository.ts`
- Create: `api/password-reset.test.ts`

**Interfaces:**
- Produces: `generateResetToken(): { raw: string; hash: string }`
- Produces: `hashResetToken(raw: string): string`
- Produces: `AdminPasswordResetTokensRepository.create`, `findValidByHash`, `deleteActiveForUser`, `deleteExpired`, `consumeAndUpdatePassword`

- [ ] Write the failing test for token generation and hashing.
- [ ] Run `npx vitest run api/password-reset.test.ts` and confirm the module is missing.
- [ ] Add the Prisma model and run the migration.
- [ ] Implement the helper and repository.
- [ ] Run the test and confirm it passes.
- [ ] Commit.

## Task 2: Mail transport abstraction

**Files:**
- Create: `api/lib/mailer.ts`
- Modify: `env.ts`
- Create: `.env.example`
- Test: `api/password-reset.test.ts`

**Interfaces:**
- Produces: `sendPasswordResetEmail(to: string, resetUrl: string): Promise<void>`

The provider is not chosen yet. Implement a transport interface. In development and test, print the link to the console. In production without a configured transport, throw. Add the provider adapter when the decision is made.

- [ ] Write the failing test for the development console fallback.
- [ ] Write the failing test for the production misconfiguration.
- [ ] Implement the transport interface and environment validation.
- [ ] Run the tests and confirm they pass.
- [ ] Commit.

## Task 3: Request endpoint

**Files:**
- Create: `api/services/admin-users/request-password-reset.ts`
- Create: `api/controllers/admin-password-reset-controller.ts`
- Create: `api/routes/admin-password-reset.ts`
- Modify: `api/index.ts`
- Modify: `api/repositories/admin-users-repository.ts`
- Modify: `api/services/admin-users/create.ts`
- Test: `api/password-reset.test.ts`

**Interfaces:**
- Produces: `POST /admin-users/password-reset/request`
- Produces: `AdminUsersRepository.findManyByEmail(email: string, take?: number)`

- [ ] Write tests for existing, unknown, duplicated, and invalid e-mail.
- [ ] Write tests for mail failure and for identical responses.
- [ ] Run the tests and confirm they fail.
- [ ] Implement the service, controller, route, and e-mail normalization.
- [ ] Run the tests and confirm they pass.
- [ ] Commit.

## Task 4: Validate endpoint

**Files:**
- Create: `api/services/admin-users/validate-password-reset-token.ts`
- Modify: `api/controllers/admin-password-reset-controller.ts`
- Modify: `api/routes/admin-password-reset.ts`
- Test: `api/password-reset.test.ts`

**Interfaces:**
- Produces: `GET /admin-users/password-reset/validate?token=...`

- [ ] Write tests for valid, expired, used, unknown, and missing tokens.
- [ ] Run the tests and confirm they fail.
- [ ] Implement the service and route.
- [ ] Run the tests and confirm they pass.
- [ ] Commit.

## Task 5: Confirm endpoint

**Files:**
- Create: `api/services/admin-users/reset-password.ts`
- Modify: `api/controllers/admin-password-reset-controller.ts`
- Modify: `api/routes/admin-password-reset.ts`
- Test: `api/password-reset.test.ts`

**Interfaces:**
- Produces: `POST /admin-users/password-reset/confirm`

- [ ] Write tests for a valid token, a reused token, an expired token, and a short password.
- [ ] Write tests for simultaneous consumption, invalidation of other tokens, and raw-token non-persistence.
- [ ] Run the tests and confirm they fail.
- [ ] Implement the service with a conditional update inside `prisma.$transaction`.
- [ ] Run the tests and confirm they pass.
- [ ] Commit.

## Task 6: Rate limit and session revocation

**Files:**
- Modify: `api/routes/admin-password-reset.ts`
- Modify: `api/repositories/refresh-tokens-repository.ts`
- Modify: `api/services/admin-users/reset-password.ts`
- Test: `api/password-reset.test.ts`

**Interfaces:**
- Produces: `RefreshTokensRepository.revokeAllForUser(userId: string): Promise<void>`

- [ ] Write the failing tests for the sixth request and for refresh revocation.
- [ ] Implement the limiters and revocation.
- [ ] Run the tests and confirm they pass.
- [ ] Commit.

## Task 7: Frontend schemas and sign-in link

**Files:**
- Modify: `src/types/interfaces.ts`
- Modify: `src/components/SignInFormComponent/SignInFormComponent.tsx:87-89`
- Test: `src/components/SignInFormComponent/SignInFormComponent.test.tsx`

- [ ] Write the failing test for `href="/forgot-password"`.
- [ ] Add `ForgotPasswordSchema` and `ResetPasswordSchema`.
- [ ] Change the link.
- [ ] Run the test and confirm it passes.
- [ ] Commit.

## Task 8: Forgot password page

**Files:**
- Create: `src/app/forgot-password/page.tsx`
- Create: `src/components/ForgotPasswordFormComponent/ForgotPasswordFormComponent.tsx`
- Create: `src/components/ForgotPasswordFormComponent/ForgotPasswordFormComponent.test.tsx`

- [ ] Write the failing tests for invalid e-mail, success, normalized e-mail, and `429`.
- [ ] Implement the page and form.
- [ ] Run the tests and confirm they pass.
- [ ] Commit.

## Task 9: Reset password page

**Files:**
- Create: `src/app/reset-password/page.tsx`
- Create: `src/components/ResetPasswordFormComponent/ResetPasswordFormComponent.tsx`
- Create: `src/components/ResetPasswordFormComponent/ResetPasswordFormComponent.test.tsx`
- Modify: `next.config.mjs`

- [ ] Write the failing tests for missing token, invalid token, valid token, mismatch, and success.
- [ ] Implement the page with a `Suspense` boundary and the form.
- [ ] Add the `Referrer-Policy: no-referrer` header.
- [ ] Run the tests and confirm they pass.
- [ ] Commit.

## Task 10: Documentation and verification

**Files:**
- Modify: `swagger.ts`
- Modify: `README.md`

- [ ] Fix the Swagger glob to `./api/**/*.ts`.
- [ ] Document the environment variables and the console transport.
- [ ] Run `npm run pretty`, `npm run lint`, and `npm test` in the backend.
- [ ] Run `npm run lint` and `npm test` in the frontend.
- [ ] Run the manual flow: request, read the console link, reset, sign in, reuse the link.
- [ ] Commit.

---

## Verification commands

Backend:

```bash
npm test
npm run lint
npm run pretty
```

Frontend:

```bash
npm test
npm run lint
```

Manual flow:

1. Start the backend with `npm run start:dev`.
2. Start the frontend with `npm run dev`.
3. Request a reset for an existing admin.
4. Copy the link from the backend console.
5. Set a new password.
6. Sign in with the new password. The old password must fail.
7. Open the same link again. It must show an invalid or expired state.
