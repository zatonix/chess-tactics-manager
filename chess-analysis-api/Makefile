SHELL := /bin/bash

.PHONY: lint
lint:
	pylint services/

.PHONY: venv
venv:
	virtualenv venv; \
	source venv/bin/activate; \
	pip install -q -r requirements.txt -r requirements-dev.txt

.PHONY: run
run:
	docker-compose --file=docker-compose.local.yaml --project-name=local up --abort-on-container-exit

.PHONY: init
init:
	docker build --rm -f ./Dockerfile -t chess-tactics-analysis:latest .

.PHONY: test
test:
	docker-compose --file=docker-compose.CI.yaml up --abort-on-container-exit
