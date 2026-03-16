# financial-sync-hub

A production-grade ERP backend that synchronizes financial data
with QuickBooks Online in real time.

Built after noticing that most QB integration tutorials stop at
"hello world". This one handles what actually happens in production —
token expiry, failed syncs, duplicate records, SyncToken conflicts,
and QB's quirky behavior around deletes.

![Architecture](./docs/architecture.png)

## What it does

Manages customers, products, invoices and payments locally, then
keeps QuickBooks Online in sync automatically in the background.
The API never waits for QuickBooks — sync happens asynchronously
so the user gets an instant response regardless of QB's availability.

If QuickBooks is down or rate-limiting, jobs queue up in Redis and
retry automatically with exponential backoff. Nothing is lost.

## Tech stack

- **NestJS** — framework
- **PostgreSQL + Prisma** — database and ORM
- **BullMQ + Redis** — background job queue
- **intuit-oauth** — QuickBooks OAuth2
- **QuickBooks Online REST API** — direct API calls (no SDK wrapper)

## Architecture

The sync system is fully decoupled from the CRUD layer:

```
HTTP request
    → saves to PostgreSQL
    → emits domain event
    → returns response immediately

[background]
    → event listener pushes job to Redis queue
    → BullMQ worker picks up job
    → calls QuickBooks API
    → saves QB id + SyncToken back to record
    → writes result to sync_logs table
```

Each entity has its own isolated queue and processor:

```
customer-sync queue → CustomerSyncProcessor
product-sync queue  → ProductSyncProcessor
invoice-sync queue  → InvoiceSyncProcessor
payment-sync queue  → PaymentSyncProcessor
```

A failure in one queue never affects the others.

## Sync log

Every sync operation — success or failure — is recorded:

```
entity_type | entity_id | action | status  | attempts | error
customer    | uuid      | create | success | 1        | null
invoice     | uuid      | create | failed  | 5        | 401 Unauthorized
```

This gives full visibility into what synced, when, and why it failed.

## QuickBooks quirks this handles

A few things the QB docs don't warn you about:

- No real delete — records are deactivated with `Active: false`
- Updates require sending ALL fields, not just changed ones
- Every update needs the current `SyncToken` or QB rejects it
- Duplicate customer names reactivate the old record instead of creating new
- Access tokens expire after 1 hour — handled with automatic refresh

## Token management

OAuth2 tokens are stored in the database, not in environment variables.
Before every QB API call, the system checks token expiry with a 5-minute
buffer. If expired, it refreshes automatically, saves the new tokens,
and proceeds — no manual intervention needed.

Refresh tokens last 100 days. As long as the app makes at least one
call every 100 days, it stays permanently authenticated.

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis (`docker run -d -p 6379:6379 redis`)
- QuickBooks Developer account and sandbox company

### Installation

```bash
git clone https://github.com/Cizawells/financial-sync-hub
cd financial-sync-hub
npm install
```

### Environment variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/financial-sync-hub

QB_CLIENT_ID=
QB_CLIENT_SECRET=
QB_REALM_ID=
QB_REDIRECT_URI=http://localhost:3000/quickbooks/callback
QB_ENVIRONMENT=sandbox
QB_BASE_URL=https://sandbox-quickbooks.api.intuit.com
```

### Database setup

```bash
npx prisma migrate dev
```

### Run

```bash
npm run start:dev
```

### QuickBooks authentication

On first run, authenticate once:

```
GET http://localhost:3000/quickbooks/connect
```

This redirects to Intuit's login page. After approving, tokens are
saved automatically to the database. You won't need to do this again
unless the refresh token expires (100 days of inactivity).

## API endpoints

### Customers

```
POST   /customers
GET    /customers
GET    /customers/:id
PATCH  /customers/:id
DELETE /customers/:id
```

### Products

```
POST   /products
GET    /products
GET    /products/:id
PATCH  /products/:id
DELETE /products/:id
PATCH  /products/:id/reactivate
```

### Invoices

```
POST   /invoices
GET    /invoices
GET    /invoices/:id
PATCH  /invoices/:id
DELETE /invoices/:id
```

### Payments

```
POST   /payments
GET    /payments
GET    /payments/:id
PATCH  /payments/:id
DELETE /payments/:id
```

### QuickBooks

```
GET    /quickbooks/connect     → start OAuth flow
GET    /quickbooks/callback    → OAuth callback (called by Intuit)
```

## What syncs to QuickBooks

| Entity   | Create | Update | Delete/Deactivate |
| -------- | ------ | ------ | ----------------- |
| Customer | ✅     | ✅     | ✅ Active: false  |
| Product  | ✅     | ✅     | ✅ Active: false  |
| Invoice  | ✅     | ✅     | ✅ Void           |
| Payment  | ✅     | ✅     | ✅ Delete         |

## Author

Ciza Wells  
App Developer at Econet  
[github.com/Cizawells](https://github.com/Cizawells)  
[cizawells.vercel.app](https://cizawells.vercel.app)
