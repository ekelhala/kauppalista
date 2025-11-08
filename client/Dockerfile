FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine-slim

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./config/nginx.conf.template /etc/nginx/nginx.conf.template

EXPOSE 3000

CMD ["sh", "-c", "envsubst '${API_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]