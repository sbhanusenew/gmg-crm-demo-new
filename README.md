# GMG CRM Demo

This folder contains a simple browser-based CRM sample with separate admin and
user portals.

## Included pages

- `index.html` CRM overview and rollout summary
- `admin-portal.html` admin workspace for lead ownership and user registration
- `user-portal.html` user workspace for lead capture and pipeline updates
- `crm-demo.css` shared dashboard styling
- `crm-demo.js` shared demo logic and browser storage

## What this sample shows

- user registration from the admin portal
- lead registration from the user portal
- stage-based pipeline tracking
- owner assignment and follow-up control
- separate admin and user workspaces
- local browser storage to simulate shared CRM records during a demo

## How the sample works

1. Admin creates CRM users in `admin-portal.html`.
2. Users select their name in `user-portal.html`.
3. Users register leads with company, contact, source, value, and next action.
4. Leads move through stages like `New Lead`, `Qualified`, `Proposal Sent`,
   `Negotiation`, `Won`, and `Lost`.
5. Admin reviews the full lead queue, reassigns owners, and updates pipeline
   quality fields.

## Important limitation

This is a front-end prototype only. It does not include:

- real login or authentication
- centralized database storage
- audit trail
- server-side permissions
- email, WhatsApp, or ERP integrations

## Recommended production architecture

For organization-wide deployment, use this sample as the UI and process model,
then rebuild the data layer with:

- frontend: React, Next.js, Vue, or your preferred web stack
- backend: Node.js, NestJS, Django, Laravel, or .NET
- database: PostgreSQL, SQL Server, or MySQL
- auth: Microsoft 365, Google Workspace, or company SSO
- hosting: Azure, AWS, DigitalOcean, or an internal company server

## Rollout plan

1. Define lead stages, fields, owner rules, and approval process.
2. Pilot with one sales team first.
3. Add real authentication and a shared database.
4. Import existing leads from Excel or Zoho exports.
5. Train users by role: admin, manager, sales executive.
6. Launch department by department and review adoption weekly.

## How to test locally

Open the files in a browser, or run the folder through a small local web server
for more reliable storage behavior.
