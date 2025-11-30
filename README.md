Blood Bank Management System

A web-based platform that facilitates blood management and requests between hospitals, doctors, and donors. Hospitals can request blood from other hospitals, doctors can request blood for their hospitals, and donors can register to donate.

Features
Hospital Requests

Hospitals can request blood from other hospitals.

Track blood type, units needed, priority, and notes.

Request status can be updated (Pending / Approved / Rejected).

Doctor Requests

Doctors can submit requests on behalf of their hospital.

Ensures urgent needs are communicated efficiently.

Donor Registration

Donors can fill a form with personal info, blood type, and availability.

Data is stored in Supabase and used to fulfill requests.

Admin Dashboard

View all hospital requests and donor registrations.

Track blood inventory and request statuses.

Analytics for blood type availability and urgent requests.

Tech Stack

Frontend: Next.js, React, TailwindCSS

Backend / API: Next.js API routes

Database: Supabase (PostgreSQL)

Authentication: Supabase Auth

Hosting / Deployment: Vercel (frontend) + Supabase (backend)

Contributing

Fork the repository

Create a branch: git checkout -b feature/your-feature

Commit your changes: git commit -m "Add feature"

Push: git push origin feature/your-feature

Open a Pull Request

License

MIT License
