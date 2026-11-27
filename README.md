# Healthcare Appointment App

Full-stack Healthcare Appointment Booking App built with **Next.js, Node.js and Prisma** — patients can find doctors, book appointments, and manage their visits from one dashboard.

> 30-day build project by **Hassaan Khan** — Full Stack Developer (Rawalpindi, Pakistan)

## Features (Roadmap)

- Doctor listing with search and filters
- Doctor detail pages
- Appointment booking, cancel and reschedule
- Patient dashboard
- Admin dashboard to manage doctors and appointments
- Authentication and protected routes
- Reviews and ratings
- Email notifications on booking

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Node.js, Next.js API Routes |
| Database | Prisma ORM, PostgreSQL |
| Auth | NextAuth |
| Deployment | Vercel |

## 30-Day Build Plan

- **Week 1:** Setup, layout, database models, authentication
- **Week 2:** Frontend — doctors, booking form, dashboards
- **Week 3:** Backend APIs, validation, notifications
- **Week 4:** Polish, tests, deployment

## Getting Started

```bash
git clone https://github.com/Hassaan2835/healthcare-appointment-app.git
cd healthcare-appointment-app
npm install
npm run dev
```

## Email notifications

Booking, rescheduling and cancelling an appointment emails the patient
a confirmation (see `src/lib/email.js`). Configure any SMTP provider
in `.env` — copy `.env.example` for the full list:

```bash
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="you@example.com"
SMTP_PASS="your-smtp-password"
EMAIL_FROM="Healthcare App <no-reply@example.com>"
```

Without SMTP settings the app still works: the email is skipped and
logged to the console instead, and a failed send never fails the
booking itself.

## Author

**Hassaan Khan** — [GitHub](https://github.com/Hassaan2835) | [Portfolio](https://www.hassaankhan.dev)
