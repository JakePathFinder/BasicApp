# Basic Service App

A minimal dockerized full-stack demo:

- **Backend** — ASP.NET Core (.NET 8) minimal API exposing the default weather forecast endpoint.
- **Frontend** — Angular 17 single-page "Hello World" UI that calls the backend and displays the forecast.

## Structure

```
BasicServiceApp/
├── backend/            ASP.NET Core Web API
│   ├── Program.cs      GET /weatherforecast
│   └── Dockerfile
├── frontend/           Angular SPA (served by nginx)
│   ├── src/main.ts     Hello World page + "Get Weather" button
│   └── Dockerfile
└── docker-compose.yml
```

## Run it

From the project root:

```bash
docker compose up --build
```

Then open:

- **UI:**       http://localhost:4200
- **API:**      http://localhost:8080/weatherforecast

Click **Get Weather** in the UI — it calls `GET http://localhost:8080/weatherforecast`
on the backend and renders the 5-day forecast in a table.

## Stop it

```bash
docker compose down
```

## Deploy to Fly.io

The app deploys as **two Fly apps** (Fly runs one app per Dockerfile — it does not
use `docker-compose.yml`). Each subdirectory has its own `fly.toml`.

Deploy the **backend** first:

```bash
cd backend
fly launch --copy-config --no-deploy --name basicapp-backend --region fra
fly deploy
```

Then the **frontend**:

```bash
cd ../frontend
fly launch --copy-config --no-deploy --name basicapp-frontend --region fra
fly deploy
```

Notes:

- The frontend's `fly.toml` sets `API_BASE = "https://basicapp-backend.fly.dev"`,
  which is injected into the browser at runtime (via `docker-env.sh` → `env.js`).
  If you name the backend app differently, update `API_BASE` to match.
- Ports are already set: backend `internal_port = 8080`, frontend `internal_port = 80`.
- The backend has permissive CORS, so the frontend origin can call it directly.

## How it fits together

- The backend listens on port `8080` (mapped to host `8080`) and has permissive CORS
  enabled so the browser-based UI can call it directly.
- The frontend is built to static files and served by nginx on port `80`
  (mapped to host `4200`).
- The browser (running on your host) reaches the API at `http://localhost:8080`,
  which is the default `apiBase` in `frontend/src/main.ts`.
