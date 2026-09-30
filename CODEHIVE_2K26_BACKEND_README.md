# CODEHIVE 2K26 --- Event Registration Platform

> A production-ready full-stack event registration and management
> platform built with **Next.js 16, TypeScript, PostgreSQL, Prisma,
> Google OAuth, Cloudinary, Resend, QR Check-in, shadcn/ui, Tailwind CSS
> v4, and Vercel**.

------------------------------------------------------------------------

## Table of Contents

-   [1. Project Overview](#1-project-overview)
-   [2. Goals](#2-goals)
-   [3. Technology Stack](#3-technology-stack)
-   [4. System Architecture](#4-system-architecture)
-   [5. Backend Architecture](#5-backend-architecture)
-   [6. Authentication --- Google
    OAuth](#6-authentication--google-oauth)
-   [7. Database Architecture](#7-database-architecture)
-   [8. Core Backend Modules](#8-core-backend-modules)
-   [9. Registration Workflow](#9-registration-workflow)
-   [10. Cloudinary Storage Workflow](#10-cloudinary-storage-workflow)
-   [11. Email Workflow](#11-email-workflow)
-   [12. QR Check-in Workflow](#12-qr-check-in-workflow)
-   [13. Admin & Role Management](#13-admin--role-management)
-   [14. Security](#14-security)
-   [15. Project Structure](#15-project-structure)
-   [16. Environment Variables](#16-environment-variables)
-   [17. Installation](#17-installation)
-   [18. Database Setup](#18-database-setup)
-   [19. Development Workflow](#19-development-workflow)
-   [20. API & Server Action
    Conventions](#20-api--server-action-conventions)
-   [21. Testing Strategy](#21-testing-strategy)
-   [22. Deployment](#22-deployment)
-   [23. Production Checklist](#23-production-checklist)
-   [24. Development Phases](#24-development-phases)
-   [25. Future Enhancements](#25-future-enhancements)

------------------------------------------------------------------------

# 1. Project Overview

**CodeHive 2K26** is an event registration and event-management platform
designed to handle the complete participant lifecycle.

The platform covers:

``` text
Discover Event
      ↓
Google Sign-In
      ↓
Registration
      ↓
Validation
      ↓
Database
      ↓
Registration ID
      ↓
QR Code
      ↓
Confirmation Email
      ↓
Event-Day Check-in
      ↓
Attendance
      ↓
Reports
      ↓
Certificates
```

The application is designed as a **single full-stack Next.js
application** instead of maintaining a separate Express backend.

### Primary users

  Role          Purpose
  ------------- --------------------------------------------------------
  Participant   Sign in, register for events, view registration and QR
  Staff         Scan QR codes and manage event-day check-in
  Organizer     Manage events, registrations, participants and reports
  Super Admin   Full platform administration

------------------------------------------------------------------------

# 2. Goals

## Primary Goals

-   Provide a fast and responsive event registration experience.
-   Support secure Google authentication.
-   Prevent duplicate registrations.
-   Generate unique registration IDs.
-   Generate QR codes for registrations.
-   Provide secure event-day QR check-in.
-   Store participant/event media using Cloudinary.
-   Send transactional emails using Resend.
-   Provide a complete admin dashboard.
-   Maintain an auditable registration and check-in history.
-   Keep the architecture simple enough for a student development team
    while remaining production-ready.

## Non-Goals

The initial version should avoid unnecessary complexity such as:

-   Separate Express backend
-   Microservices
-   Kubernetes
-   Multiple databases
-   Custom authentication implementation
-   Storing images directly in PostgreSQL

------------------------------------------------------------------------

# 3. Technology Stack

## Frontend

-   **Next.js 16**
-   **React**
-   **TypeScript**
-   **Tailwind CSS v4**
-   **shadcn/ui**
-   **Lucide React**
-   **Framer Motion**

## Backend

-   **Next.js Server Actions**
-   **Next.js Route Handlers**
-   **TypeScript**
-   **Zod**

## Authentication

-   **Google OAuth**
-   **Auth.js / NextAuth**
-   Secure server-side sessions

## Database

-   **PostgreSQL**
-   **Neon PostgreSQL**
-   **Prisma ORM**

## Storage

-   **Cloudinary**

Used for:

-   Participant photos
-   Event posters
-   Sponsor logos
-   Certificates
-   Event gallery media

## Email

-   **Resend**

Used for:

-   Registration confirmation
-   Registration updates
-   Event reminders
-   Check-in confirmation
-   Certificate delivery

## QR

-   QR code generation library
-   QR scanner library for event-day check-in

## Deployment

-   **Vercel**
-   **GitHub**
-   **pnpm**

------------------------------------------------------------------------

# 4. System Architecture

``` text
                         CODEHIVE 2K26
                               │
                               ▼
                       ┌─────────────────┐
                       │    Next.js 16   │
                       │   App Router    │
                       └────────┬────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
         Public UI        Server Actions      Route Handlers
              │                 │                 │
              └─────────────────┼─────────────────┘
                                ▼
                         Zod Validation
                                │
                                ▼
                         Business Logic
                                │
                                ▼
                           Prisma ORM
                                │
                                ▼
                      PostgreSQL / Neon
                                │
        ┌───────────────────────┼──────────────────────┐
        ▼                       ▼                      ▼
   Cloudinary                 Resend                 Auth.js
     Media                     Email                 Google OAuth
                                │
                                ▼
                         QR / Check-in
                                │
                                ▼
                         Admin Reports
                                │
                                ▼
                            Vercel
```

------------------------------------------------------------------------

# 5. Backend Architecture

CodeHive should use a **modular monolithic architecture**.

This means everything is contained in one Next.js application, but the
backend is separated logically into modules.

``` text
Next.js
│
├── Authentication
├── Events
├── Participants
├── Registrations
├── Teams
├── Payments
├── QR / Check-in
├── Cloudinary
├── Email
├── Admin
├── Reports
├── Certificates
└── Audit Logs
```

### Request lifecycle

``` text
Client
  ↓
Server Action / Route Handler
  ↓
Authentication
  ↓
Authorization
  ↓
Zod Validation
  ↓
Business Logic
  ↓
Prisma
  ↓
PostgreSQL
  ↓
External Services
  ├── Cloudinary
  ├── Resend
  └── QR
```

### Important rule

Never allow client-side code to directly perform privileged database
operations.

------------------------------------------------------------------------

# 6. Authentication --- Google OAuth

CodeHive uses **Google OAuth** as the primary participant authentication
method.

## Authentication flow

``` text
Participant
    ↓
"Continue with Google"
    ↓
Google OAuth
    ↓
Google Consent
    ↓
Callback
    ↓
Auth.js
    ↓
Create / Update User
    ↓
Create Session
    ↓
CodeHive Dashboard
```

## Why Google OAuth?

-   No password management.
-   Familiar participant experience.
-   Lower friction during registration.
-   Email identity is verified by the OAuth provider.
-   Works well with a college event platform.

## Authentication rules

Participants:

``` text
Google Sign-In
       ↓
Session
       ↓
Registration
```

Admins/staff:

``` text
Google Sign-In
       ↓
Session
       ↓
Role check
       ↓
Admin / Staff access
```

Authentication and authorization are separate:

``` text
Authentication = Who are you?

Authorization = What are you allowed to do?
```

## Recommended role model

``` text
SUPER_ADMIN
ORGANIZER
STAFF
PARTICIPANT
```

Never trust a role sent from the browser. Always read the authenticated
user's role from the server-side session/database.

------------------------------------------------------------------------

# 7. Database Architecture

PostgreSQL is the source of truth.

## Core entities

``` text
User
Event
EventCategory
Participant
Team
TeamMember
Registration
Payment
CheckIn
Certificate
AuditLog
```

## Relationship

``` text
User
 │
 └── Participant
       │
       ├── Registration
       │       │
       │       ├── Event
       │       ├── Team
       │       ├── Payment
       │       └── CheckIn
       │
       └── Certificate
```

## Recommended core fields

### User

``` text
id
name
email
image
role
googleAccountId
createdAt
updatedAt
```

### Event

``` text
id
name
slug
description
venue
startAt
endAt
capacity
registrationOpen
registrationDeadline
createdAt
updatedAt
```

### Participant

``` text
id
userId
name
email
phone
college
department
year
imageUrl
cloudinaryPublicId
createdAt
updatedAt
```

### Registration

``` text
id
registrationNumber
participantId
eventId
status
qrToken
checkedIn
createdAt
updatedAt
```

### CheckIn

``` text
id
registrationId
staffId
checkedInAt
deviceInfo
```

### AuditLog

``` text
id
actorId
action
entity
entityId
metadata
createdAt
```

------------------------------------------------------------------------

# 8. Core Backend Modules

## 8.1 Authentication

Responsibilities:

``` text
Google OAuth
Session management
User creation
User synchronization
Role authorization
Protected routes
```

------------------------------------------------------------------------

## 8.2 Event Management

Operations:

``` text
createEvent()
getEvent()
getEvents()
updateEvent()
deleteEvent()
publishEvent()
closeRegistration()
```

Event lifecycle:

``` text
DRAFT
  ↓
PUBLISHED
  ↓
REGISTRATION_OPEN
  ↓
REGISTRATION_CLOSED
  ↓
EVENT_COMPLETED
```

------------------------------------------------------------------------

## 8.3 Participant Management

Operations:

``` text
getParticipant()
updateParticipant()
searchParticipants()
```

Participants should not be able to edit protected registration fields
such as:

``` text
registrationNumber
status
paymentStatus
checkedIn
```

------------------------------------------------------------------------

## 8.4 Registration Engine

Responsibilities:

``` text
Validate event
Check registration window
Check capacity
Check duplicate registration
Create participant record
Create registration
Generate registration number
Generate QR token
Trigger confirmation email
```

------------------------------------------------------------------------

## 8.5 Team Management

For team-based events:

``` text
Team
  │
  ├── Leader
  ├── Member
  ├── Member
  └── Member
```

Rules should define:

``` text
Minimum team size
Maximum team size
Team leader
Member uniqueness
Event eligibility
```

------------------------------------------------------------------------

## 8.6 Payment Module

Only required for paid events.

Flow:

``` text
Registration
    ↓
Payment Order
    ↓
Payment Provider
    ↓
Payment Success
    ↓
Server Verification
    ↓
Webhook
    ↓
Payment CONFIRMED
    ↓
Registration CONFIRMED
```

Never trust a client-side payment-success message.

------------------------------------------------------------------------

## 8.7 Check-in Module

Responsibilities:

``` text
Validate QR
Find registration
Validate registration status
Prevent duplicate check-in
Record staff identity
Record timestamp
Return result
```

------------------------------------------------------------------------

## 8.8 Reporting Module

Reports:

``` text
Total registrations
Event-wise registrations
College-wise registrations
Department-wise registrations
Confirmed registrations
Cancelled registrations
Attendance
Check-in percentage
Payment status
```

Export:

``` text
CSV
```

------------------------------------------------------------------------

# 9. Registration Workflow

This is the most important backend workflow.

``` text
User
 ↓
Google Sign-In
 ↓
Event Details
 ↓
Register
 ↓
React Hook Form
 ↓
Zod Validation
 ↓
Server Action
 ↓
Authentication Check
 ↓
Event Validation
 ↓
Capacity Check
 ↓
Duplicate Check
 ↓
Database Transaction
 ├── Create / Update Participant
 └── Create Registration
 ↓
Generate Registration Number
 ↓
Generate QR Token
 ↓
Commit Transaction
 ↓
Send Confirmation Email
 ↓
Registration Success
```

## Duplicate protection

The backend should prevent:

``` text
Same user
+
Same event
+
Multiple active registrations
```

Use both:

1.  Application-level validation.
2.  Database unique constraints.

------------------------------------------------------------------------

# 10. Cloudinary Storage Workflow

Images should not be stored in PostgreSQL.

``` text
Browser
   ↓
Secure Upload
   ↓
Cloudinary
   ↓
Secure URL + Public ID
   ↓
PostgreSQL
```

Database stores:

``` text
imageUrl
cloudinaryPublicId
```

Suggested folders:

``` text
codehive/
├── participants/
├── events/
├── sponsors/
├── certificates/
└── gallery/
```

## Security

Never expose:

``` text
CLOUDINARY_API_SECRET
```

to client-side code.

------------------------------------------------------------------------

# 11. Email Workflow

## Registration Confirmation

``` text
Registration Confirmed
        ↓
Generate email
        ↓
Resend
        ↓
Participant
```

Email contents:

``` text
CODEHIVE 2K26

Registration Confirmed

Registration ID:
CH26-8F3K21

Participant:
Participant Name

Event:
Hackathon

Venue:
Event Venue

Date:
Event Date

QR Code:
[QR]
```

## Email templates

``` text
registration-confirmation
registration-update
event-reminder
payment-confirmation
checkin-confirmation
certificate-delivery
```

------------------------------------------------------------------------

# 12. QR Check-in Workflow

The QR code should contain a secure token or opaque identifier, not
sensitive participant data.

``` text
Participant
    ↓
Registration
    ↓
Generate QR Token
    ↓
Generate QR Code
    ↓
Participant receives QR
```

Event day:

``` text
Staff
 ↓
Scan QR
 ↓
POST /api/check-in
 ↓
Authenticate Staff
 ↓
Validate QR
 ↓
Find Registration
 ↓
Check Registration Status
 ↓
Check Already Checked In
 ↓
Create CheckIn
 ↓
Return Success
```

### Duplicate scan

First scan:

``` text
SUCCESS
Checked in successfully.
```

Second scan:

``` text
ALREADY_CHECKED_IN
Participant was already checked in.
```

------------------------------------------------------------------------

# 13. Admin & Role Management

## SUPER_ADMIN

``` text
Everything
```

## ORGANIZER

``` text
Events
Registrations
Participants
Teams
Reports
Check-in
```

## STAFF

``` text
QR Check-in
Limited participant lookup
```

## PARTICIPANT

``` text
Profile
Events
Registrations
QR
Certificates
```

### Admin route

``` text
/admin
/admin/dashboard
/admin/events
/admin/registrations
/admin/participants
/admin/check-in
/admin/reports
/admin/settings
```

Every privileged route must perform server-side authorization.

------------------------------------------------------------------------

# 14. Security

## Authentication

-   Google OAuth through Auth.js.
-   Secure sessions.
-   Protected admin routes.
-   Server-side session verification.

## Authorization

-   Role-based access control.
-   Server-side permission checks.
-   Never trust client-provided roles.

## Validation

-   Zod schemas.
-   Server-side validation for every mutation.
-   Normalize email/phone before duplicate checks.

## Database

-   Unique constraints.
-   Foreign keys.
-   Transactions for critical operations.
-   Indexed search fields.

## Uploads

-   File type validation.
-   File size validation.
-   Cloudinary secrets remain server-only.

## API

-   Rate limiting for sensitive public endpoints.
-   Safe error responses.
-   No stack traces in production.

## Secrets

Never commit:

``` text
.env
.env.local
```

to Git.

------------------------------------------------------------------------

# 15. Project Structure

``` text
codehive2k26/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── events/
│   │   ├── register/
│   │   └── registration/
│   │
│   ├── dashboard/
│   │
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── registrations/
│   │   ├── participants/
│   │   ├── check-in/
│   │   └── reports/
│   │
│   ├── api/
│   │   ├── check-in/
│   │   ├── registrations/
│   │   └── webhooks/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── actions/
│   ├── event.ts
│   ├── participant.ts
│   ├── registration.ts
│   ├── team.ts
│   └── checkin.ts
│
├── components/
│   ├── ui/
│   ├── auth/
│   ├── events/
│   ├── registration/
│   ├── admin/
│   └── check-in/
│
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── cloudinary.ts
│   ├── resend.ts
│   ├── qr.ts
│   └── validations/
│       ├── event.ts
│       ├── registration.ts
│       ├── participant.ts
│       └── checkin.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── types/
├── hooks/
├── utils/
│
├── .env.local
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
└── README.md
```

------------------------------------------------------------------------

# 16. Environment Variables

Create `.env.local`:

``` env
# Database
DATABASE_URL=
DIRECT_URL=

# Auth.js
AUTH_SECRET=

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend
RESEND_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Keep all secrets server-side. Do not prefix private credentials with
> `NEXT_PUBLIC_`.

------------------------------------------------------------------------

# 17. Installation

## Create project

``` bash
pnpm create next-app@latest codehive2k26
```

Recommended options:

``` text
TypeScript       → Yes
ESLint           → Yes
React Compiler   → No
Tailwind CSS     → Yes
src/ directory   → No
App Router       → Yes
AGENTS.md        → Yes
```

Enter the project:

``` bash
cd codehive2k26
```

------------------------------------------------------------------------

## Install dependencies

``` bash
pnpm add @auth/prisma-adapter
pnpm add next-auth
pnpm add @prisma/client
pnpm add zod
pnpm add react-hook-form
pnpm add cloudinary
pnpm add resend
pnpm add qrcode
```

Initialize Prisma:

``` bash
pnpm prisma init
```

Install development dependencies as needed:

``` bash
pnpm add -D prisma
```

------------------------------------------------------------------------

# 18. Database Setup

After configuring `DATABASE_URL`:

``` bash
pnpm prisma migrate dev --name init
```

Generate Prisma Client:

``` bash
pnpm prisma generate
```

Seed development data:

``` bash
pnpm prisma db seed
```

Open Prisma Studio:

``` bash
pnpm prisma studio
```

Production migration:

``` bash
pnpm prisma migrate deploy
```

------------------------------------------------------------------------

# 19. Development Workflow

## Step 1 --- Foundation

``` text
Next.js
TypeScript
Tailwind
shadcn/ui
pnpm
```

## Step 2 --- Authentication

``` text
Auth.js
Google OAuth
Session
Roles
```

## Step 3 --- Database

``` text
PostgreSQL
Prisma
Schema
Migrations
Seed
```

## Step 4 --- Event Backend

``` text
Event CRUD
Categories
Capacity
Registration window
```

## Step 5 --- Registration

``` text
Participant
Registration
Validation
Duplicate protection
Registration ID
```

## Step 6 --- External Services

``` text
Cloudinary
Resend
QR
```

## Step 7 --- Admin

``` text
Dashboard
Registrations
Participants
Events
Reports
```

## Step 8 --- Event Day

``` text
QR Scanner
Check-in
Duplicate protection
Attendance
```

## Step 9 --- Hardening

``` text
Security
Testing
Rate limiting
Audit logs
Error handling
```

## Step 10 --- Production

``` text
Vercel
Neon
Cloudinary
Resend
Google OAuth production credentials
```

------------------------------------------------------------------------

# 20. API & Server Action Conventions

Prefer Server Actions for internal application mutations:

``` text
createEvent()
updateEvent()
createRegistration()
updateRegistration()
checkInParticipant()
```

Use Route Handlers where an HTTP endpoint is useful:

``` text
/api/check-in
/api/webhooks/*
/api/registrations/*
```

## Response convention

Use predictable result structures.

Success:

``` ts
{
  success: true,
  data: ...
}
```

Failure:

``` ts
{
  success: false,
  error: {
    code: "DUPLICATE_REGISTRATION",
    message: "You are already registered for this event."
  }
}
```

Suggested error codes:

``` text
UNAUTHORIZED
FORBIDDEN
INVALID_INPUT
EVENT_NOT_FOUND
EVENT_CLOSED
EVENT_FULL
DUPLICATE_REGISTRATION
REGISTRATION_NOT_FOUND
ALREADY_CHECKED_IN
INVALID_QR
INTERNAL_ERROR
```

------------------------------------------------------------------------

# 21. Testing Strategy

## Unit Tests

Test:

``` text
Zod schemas
Registration number generation
Status transitions
Permission checks
Utility functions
```

## Integration Tests

Test:

``` text
Server Action
    ↓
Validation
    ↓
Prisma
    ↓
Database
```

## E2E Tests

Critical flow:

``` text
Google Login
    ↓
Select Event
    ↓
Register
    ↓
Confirmation
    ↓
View QR
    ↓
Staff Login
    ↓
Scan QR
    ↓
Check-in
```

## Edge Cases

Test:

``` text
Event full
Registration closed
Duplicate registration
Invalid QR
Already checked in
Unauthorized admin
Expired/invalid session
Invalid upload
Concurrent registration attempts
```

------------------------------------------------------------------------

# 22. Deployment

## Architecture

``` text
GitHub
   ↓
Vercel
   ↓
Next.js
   ↓
Prisma
   ↓
Neon PostgreSQL

External Services
├── Google OAuth
├── Cloudinary
└── Resend
```

## Environments

Maintain:

``` text
Development
Preview
Production
```

Never use production credentials locally unless absolutely necessary.

------------------------------------------------------------------------

# 23. Production Checklist

## Application

-   [ ] Production build succeeds.
-   [ ] ESLint passes.
-   [ ] TypeScript passes.
-   [ ] All environment variables configured.
-   [ ] Error pages implemented.
-   [ ] Mobile UI tested.

## Google OAuth

-   [ ] Production Google OAuth client configured.
-   [ ] Authorized JavaScript origins configured.
-   [ ] Authorized redirect URI configured.
-   [ ] Production `AUTH_SECRET` configured.
-   [ ] OAuth callback tested.

## Database

-   [ ] Production PostgreSQL configured.
-   [ ] Prisma migrations applied.
-   [ ] Indexes verified.
-   [ ] Unique constraints verified.
-   [ ] Backup/recovery plan documented.

## Cloudinary

-   [ ] Production cloud configured.
-   [ ] Upload limits configured.
-   [ ] Secrets stored securely.
-   [ ] Image transformations tested.

## Email

-   [ ] Resend production API key configured.
-   [ ] Sender identity configured.
-   [ ] Confirmation email tested.

## Check-in

-   [ ] QR generation tested.
-   [ ] QR scanner tested on mobile.
-   [ ] Duplicate check-in prevented.
-   [ ] Staff authorization tested.

## Security

-   [ ] Admin authorization tested.
-   [ ] Rate limits implemented where required.
-   [ ] Secrets excluded from Git.
-   [ ] Client cannot modify protected fields.
-   [ ] Production error responses don't expose secrets.

------------------------------------------------------------------------

# 24. Development Phases

## Phase 01 --- Project Foundation

``` text
Next.js
TypeScript
pnpm
Tailwind
shadcn/ui
Git
Environment setup
```

### Output

A clean Next.js application.

------------------------------------------------------------------------

## Phase 02 --- Google Authentication

``` text
Auth.js
Google OAuth
User model
Session
Role system
Protected routes
```

### Output

Secure Google sign-in and role-aware sessions.

------------------------------------------------------------------------

## Phase 03 --- Database

``` text
PostgreSQL
Prisma
Schema
Migrations
Seed
Indexes
Constraints
```

### Output

Stable database foundation.

------------------------------------------------------------------------

## Phase 04 --- Event Management

``` text
Event CRUD
Categories
Capacity
Registration deadline
Event status
```

### Output

Complete event backend.

------------------------------------------------------------------------

## Phase 05 --- Registration Engine

``` text
Participant
Registration
Validation
Duplicate prevention
Transactions
Registration ID
```

### Output

Working registration system.

------------------------------------------------------------------------

## Phase 06 --- Cloudinary + Email + QR

``` text
Cloudinary
Resend
QR generation
Confirmation workflow
```

### Output

Complete registration confirmation package.

------------------------------------------------------------------------

## Phase 07 --- Admin Dashboard

``` text
Dashboard
Registrations
Participants
Events
Search
Filters
Reports
```

### Output

Complete administrative backend.

------------------------------------------------------------------------

## Phase 08 --- Event-Day Check-in

``` text
QR scanner
QR validation
Staff authorization
Duplicate protection
Attendance
Audit logs
```

### Output

Production event-day operations system.

------------------------------------------------------------------------

## Phase 09 --- Security & Testing

``` text
Authorization
Validation
Rate limiting
Unit tests
Integration tests
E2E tests
Security testing
```

### Output

Hardened application.

------------------------------------------------------------------------

## Phase 10 --- Production

``` text
Neon
Vercel
Google OAuth Production
Cloudinary Production
Resend Production
Monitoring
Backups
```

### Output

Live CodeHive 2K26 platform.

------------------------------------------------------------------------

# 25. Future Enhancements

After the core platform is stable, possible additions include:

``` text
Payment Gateway
Team Registration
Certificate Generator
Event Leaderboard
Announcements
Push Notifications
WhatsApp integration
Advanced Analytics
College-wise Analytics
Event-wise Analytics
Attendance Analytics
Sponsor Management
Event Gallery
Participant Certificate Verification
```

Potential future architecture:

``` text
                       CODEHIVE 2K26
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         Participants     Events       Admins
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                       Registration
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          Payment           QR           Email
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                         Check-in
                            │
                            ▼
                        Attendance
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
              Analytics          Certificates
```

------------------------------------------------------------------------

# Final Architecture

``` text
┌─────────────────────────────────────────────────────────┐
│                    CODEHIVE 2K26                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Next.js 16 + TypeScript + App Router                  │
│                                                         │
│  Tailwind CSS v4 + shadcn/ui + Framer Motion            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Auth.js + Google OAuth                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Server Actions + Route Handlers + Zod                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Prisma ORM                                             │
│             │                                           │
│             ▼                                           │
│       PostgreSQL / Neon                                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Cloudinary     Resend       QR / Check-in              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Vercel + GitHub + pnpm                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Core Engineering Principle

> **Keep the registration path simple, transactional, secure, auditable,
> and reliable.**

The backend should make the following journey work flawlessly:

``` text
Google Login
     ↓
Event
     ↓
Registration
     ↓
Validation
     ↓
PostgreSQL
     ↓
Registration ID
     ↓
QR
     ↓
Email
     ↓
Event Day
     ↓
QR Check-in
     ↓
Attendance
     ↓
Reports
     ↓
Certificates
```

That is the **CodeHive 2K26 backend source of truth** and the
recommended implementation order.
