# Frontend

A modular React/Vite frontend with login and signup screens.

## Run locally

```sh
npm install
npm run dev
```

## Configure the app name

Change `VITE_APP_NAME` in `.env` to update the name used in the login screen,
footer, page title, and page description.

## Connect the authentication API

Set `VITE_API_BASE_URL` in a local `.env` file to the backend origin, with or
without the `/api/v1` suffix, for example:

```env
VITE_API_BASE_URL=http://localhost:3000
```

The login and signup paths are centralized in `src/config/api.js` and default to
`/auth/login` and `/auth/signup`. Update those values to match your backend.
The frontend sends JSON `POST` requests with `username` and `password`, and
signup also includes `fullName`. A successful response may be any 2xx response;
error responses can include a JSON `message` to show a useful form error.

The monthly and weekly dashboard views load from `GET /api/v1/analytics/monthly`
and `GET /api/v1/analytics/weekly`. Use the period toggle to select a view.
**Refresh data** sends `POST /api/v1/analytics/refresh?period=<monthly|weekly>`
with no request body and renders the response directly without an additional GET.
The dashboard renders period and comparison dates, source statuses, KPI changes,
daily line charts, animated click-share pie charts for top queries and pages, and
the five report tables. Missing values and empty datasets use explicit
unavailable/empty states instead of fabricated zeros.

## Dashboard and API route tester

After a successful login, the app opens the dashboard. The dashboard and
`/test-api` route are guarded by a cookie-verified session. The frontend calls
`GET /auth/me` with credentials on startup and confirms the login cookie after
the login request; a `401` or `403` redirects to the login page. The API tester
lets you enter a separate JSON body for each POST request and view its status
and response. Routes are defined in `src/config/api.js`.

The tester includes these POST endpoints:

- Google Search Console: `/api/v1/gsc/search-performance`
- Google Analytics 4: `/api/v1/ga4/report`
- Google Sheets: `/api/v1/google-sheets/values`

The client-side route guard controls frontend navigation only. Enforce
authentication and authorization in the backend for protected data.
Because auth requests include cookies across origins, configure backend CORS
to allow the frontend origin and credentials.

## Appearance and settings

The floating navigation bar provides icon links to the dashboard and the
protected `/settings` placeholder, plus a light/dark theme toggle. The selected
theme is saved in browser local storage and applies across the app.
