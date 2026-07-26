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

## How it fits together

- The backend listens on port `8080` (mapped to host `8080`) and has permissive CORS
  enabled so the browser-based UI can call it directly.
- The frontend is built to static files and served by nginx on port `80`
  (mapped to host `4200`).
- The browser (running on your host) reaches the API at `http://localhost:8080`,
  which is the default `apiBase` in `frontend/src/main.ts`.
