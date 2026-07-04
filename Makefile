.PHONY: build up down

build:
	docker compose build

up:
	docker compose --env-file .env up -d

down:
	docker compose down