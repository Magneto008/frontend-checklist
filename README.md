# Release Checklist UI

This repository contains the frontend for the Release Checklist Tool.
It is a single-page application that allows users to create releases and track their progress using a fixed checklist of steps.

The frontend communicates with a deployed backend API using a hardcoded API URL for simplicity.

---

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Fetch API

---

## Application Overview

The application displays a list of software releases and allows the user to:

- Create a new release
- View release details
- Toggle checklist steps on and off
- Update additional release notes
- Delete a release

Each release has a status (planned, ongoing, done) that is automatically computed by the backend based on the completion state of the checklist steps.

---

## API Configuration

For simplicity and to reduce setup steps, the backend API URL is hardcoded directly in the frontend source code.

API URL used by the application:

https://release-checklist-backend.onrender.com/api/releases

This approach avoids environment variable configuration and keeps the project easy to run and review for the purpose of this assignment.

---

## Running the App Locally

### 1. Install dependencies

npm install

### 2. Start the development server

npm run dev

The application will be available at:

http://localhost:5173

The frontend will connect directly to the deployed backend API.

---

## Application Flow

1. The application fetches all releases from the backend API.
2. Releases are displayed in a list with their name, date, and status.
3. Selecting a release opens a detailed view.
4. Checklist steps can be toggled on or off.
5. Changes are saved via API calls and reflected immediately in the UI.
6. The release status updates automatically based on step completion.

---

## Notes

- This is a single-user application by design.
- No authentication or user management is included.
- The checklist steps are fixed and shared across all releases.
- The focus of this project is correctness, clarity, and usability rather than advanced UI design.

---

## Deployment

The frontend can be deployed using platforms such as Vercel or Netlify.
Since the API URL is hardcoded, no environment variables are required for deployment.
