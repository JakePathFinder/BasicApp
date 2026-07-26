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

EXPOSE 80
