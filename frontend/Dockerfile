FROM node:24.1.0-alpine3.22 AS build

WORKDIR /app

COPY package*.json .

RUN npm install --no-cache

COPY . .

RUN npm run build

FROM nginx:1.27.5-alpine3.21

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]