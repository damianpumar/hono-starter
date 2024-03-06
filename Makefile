docker/build:
	docker compose build
docker/up:
	docker compose up
docker/down:
	docker compose down

dev/install:
	npm install
dev/run:
	npm run dev
dev/build:
	npm run build

db/start:
	npm run db/start
db/stop:
	npm run db/stop