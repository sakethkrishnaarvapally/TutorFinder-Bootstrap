# TutorFinder (Bootstrap 5)

React 18 + Vite + React Router + Bootstrap 5.3 application.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Features retained

- Student, tutor and admin authentication using the existing AuthContext and Local Storage utilities.
- Tutor signup and admin approval.
- Student tutor search by subject, location and availability.
- Tutor profile pages.
- Student-to-tutor requests with pending, accepted and rejected states.
- Tutor dashboard request management.
- Admin user, tutor and request management.

## Bootstrap

Bootstrap 5 CSS, Bootstrap Icons and the Bootstrap JavaScript bundle are imported in `src/main.jsx`.

## Demo admin

- Email: `admin@tutorfinder.com`
- Password: `admin123`

This project currently uses browser Local Storage. Data is local to the browser and is not synchronized between different devices or users.
