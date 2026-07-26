# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build

# --- Serve stage ---
FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Runtime env injection: writes env.js before nginx starts.
COPY docker-env.sh /docker-entrypoint.d/40-env.sh
RUN chmod +x /docker-entrypoint.d/40-env.sh

EXPOSE 80
