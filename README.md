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
`/auth/login` and `/auth/register`. Update those values to match your backend.
The frontend sends JSON `POST` requests with `username` and `password`, and
signup also includes `fullname`. A
successful response may be any 2xx response;
error responses can include a JSON `message` to show a useful form error.

The monthly and weekly dashboard views load from
`GET /api/v1/clients/:id/analytics/monthly` and
`GET /api/v1/clients/:id/analytics/weekly`. Use the period toggle to select a view.
**Refresh data** sends `POST /api/v1/clients/:id/analytics/refresh?period=<monthly|weekly>`
with no request body and renders the response directly without an additional GET.
The dashboard renders period and comparison dates, source statuses, KPI changes,
daily line charts, animated click-share pie charts for top queries and pages, and
the five report tables. Missing values and empty datasets use explicit
unavailable/empty states instead of fabricated zeros.
Use **Generate PDF** to request the selected period from
`GET /api/v1/reports/monthly` or `GET /api/v1/reports/weekly` with cookies
included. The report is built from stored backend snapshots; it does not refresh
integrations. After the PDF is ready, **Save PDF** opens the native save picker
where supported, with a standard browser download as the fallback.

## Dashboard

After a successful login, the app opens the dashboard. Dashboard and settings
routes are guarded by a cookie-verified session. Protected-route
navigation and the guest route call `GET /auth/me` with credentials, including
after successful login or signup. A failed session check leaves the auth form
available without showing a `/me` error warning, while protected routes remain
inaccessible until the session is verified. Routes are defined in
`src/config/api.js`.
On initial load, the guest route shows a temporary loader during session
restoration; a valid cookie opens the dashboard without first displaying forms.
The navbar's logout icon sends `POST /api/v1/auth/logout` with credentials
before clearing the local session.

Clients load from `GET /api/v1/clients` and are created with
`POST /api/v1/clients`. The create body includes `name` and `integrations`,
containing `gsc`, `ga4`, and `google_sheets` objects with their `enabled` flags
and property values. Updates use the same body shape at
`PATCH /api/v1/clients/:id`. Deletions use `DELETE /api/v1/clients/:id`. Signup sends
only `fullname`, `username`, and `password`; integrations are configured per client.

The client-side route guard controls frontend navigation only. Enforce
authentication and authorization in the backend for protected data.
Because auth requests include cookies across origins, configure backend CORS
to allow the frontend origin and credentials.

## Appearance and settings

The floating navigation bar provides icon links to the dashboard and the
protected `/settings` page, plus a light/dark theme toggle. The settings page
loads and updates profile settings through credentialed requests; integrations
are configured on individual clients. The settings API uses credentialed
`GET /api/v1/me` and `PATCH /api/v1/me` requests. The selected theme is saved in
browser local storage and applies across the app.
