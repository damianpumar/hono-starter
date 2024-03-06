release/build:
	docker compose build
release/up:
	docker compose up
release/down:
	docker compose down

backend/install:
	npm install
backend/run:
	npm run dev
backend/build:
	npm run build

db/start:
	npm run db/start
db/stop:
	npm run db/stop

dev:
	npm run db/start && \
	npm run db/migrate && \
	npm run dev
