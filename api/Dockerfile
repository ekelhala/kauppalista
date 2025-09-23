FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o ./bin/server ./cmd/server/main.go && \
    chmod a+x ./bin/server

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/bin/server ./bin/server

RUN addgroup -S api && \
    adduser -S -G api -h /app -s /bin/false api && \
    chown -R api:api /app
USER api

EXPOSE 8080

CMD ["./bin/server"]