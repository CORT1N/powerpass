FROM node:24.1.0-alpine3.22

WORKDIR /app

COPY package.json .

RUN npm install --no-cache

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--port", "3000", "--host"]