FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o ./bin/server ./cmd/server/main.go
RUN chmod +x ./bin/server

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/bin/server ./bin/server

EXPOSE 8080

CMD ["./bin/server"]