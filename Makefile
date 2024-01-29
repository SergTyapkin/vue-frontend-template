#TAG ?= $(shell git symbolic-ref -q --short HEAD || git describe --tags --exact-match)
include docker-deploy/.env

generate-certs:
	cd docker-deploy && \
	docker compose down && \
	docker compose up -d nginx-certbot && \
	docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d $(DOMAIN_URL)
renew-certs:
	cd docker-deploy && \
	docker compose run --rm certbot renew
set-auto-renewing-certs:
	sudo apt-get update
	sudo apt-get install cron
	echo "----------------------------------------------------------------------------------------------" && \
	echo "Now you must add this string-command in your crontab to auto executing it each 1 month. Command:" && \
	echo "" && \
	echo "0 0 1 * * cd $$(pwd) && make run renew-certs >> ./certbot-renew.log" && \
	echo "" && \
	echo "Copy that command and press [Enter]. Then add this string in end of opened file." && \
	read ENTER
	crontab -e

run:
	cd docker-deploy && \
	docker compose down && \
	docker compose up -d nginx

build:
	cd docker-deploy && \
	docker compose build --no-cache --progress=plain nginx

update:
	git fetch --all
	git reset --hard origin/master
	git log --oneline -1
	cd docker-deploy && \
	docker compose up -d nginx --build
	echo "Frontend updated successfully"
