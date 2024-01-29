#TAG ?= $(shell git symbolic-ref -q --short HEAD || git describe --tags --exact-match)

generate-certs:
	cd docker-deploy
	docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d your.domain
renew-certs:
	cd docker-deploy
	docker compose run --rm certbot renew
set-auto-renewing-certs:
	sudo apt-get update
	sudo apt-get install cron
	echo "Now you must add this string-command in your crontab to auto executing it each month. Command:"
	echo "0 0 1 * * cd $(pwd) && make run renew-certs >> ./certbot-renew.log"

run:
	cd docker-deploy
	docker compose down
	dcoker compose up -d nginx

update:
	git fetch --all
	git reset --hard origin/master
	git log --oneline -1
	cd docker-deploy
	docker compose up -d nginx --build
	echo "Frontend updated successfully"
