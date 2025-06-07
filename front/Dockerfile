FROM node:23-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

ARG API_URL
ENV API_URL=$API_URL

RUN sed -i "s|PRODUCTION_API_URL|$API_URL|g" src/app/environments/environment.prod.ts

RUN npm run build --omit=dev

FROM nginx:alpine

COPY --from=build /app/dist/fintrack-front/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
