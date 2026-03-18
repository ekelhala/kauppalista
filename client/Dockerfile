FROM node:24-alpine AS builder

WORKDIR /app

ARG VITE_AUTH_AUTHORITY
ARG VITE_AUTH_CLIENT_ID
ARG VITE_AUTH_SCOPE
ARG VITE_AUTH_AUDIENCE
ENV VITE_AUTH_AUTHORITY=${VITE_AUTH_AUTHORITY}
ENV VITE_AUTH_CLIENT_ID=${VITE_AUTH_CLIENT_ID}
ENV VITE_AUTH_SCOPE=${VITE_AUTH_SCOPE}
ENV VITE_AUTH_AUDIENCE=${VITE_AUTH_AUDIENCE}

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine-slim

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./config/nginx.conf.template /etc/nginx/nginx.conf.template

EXPOSE 3000

CMD ["sh", "-c", "envsubst '${API_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]