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

setup-ci:
	# Add user if not exists
	id -u github &>/dev/null || sudo adduser github
	sudo -u github ssh-keygen
	#ssh-keygen -t ed25519 -a 200 -C "your_email@example.com"\
	sudo cat /home/github/.ssh/id_rsa.pub >> /home/github/.ssh/authorized_keys
	#cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
	#cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys2
	sudo chmod 777 -R /home/github/.ssh
	sudo chmod 666 /home/github/.ssh/authorized_keys
	nano /etc/ssh/sshd_config
	#AllowUsers github
	#Match User github
	#PasswordAuthentication no
	#AllowTCPForwarding no
	#X11Forwarding no
	echo "" && \
	echo 'Add this public rsa key to Deploy keys in your github directory: [press Enter]' && \
	read ENTER && \
	sudo less /home/github/.ssh/id_rsa

all:
	cp --no-clobber ./docker-deploy/.env.example ./docker-deploy/.env
	edit ./docker-deploy/.env
	make generate-scripts
	make set-auto-renewing-certs
	make setup-ci
	make update
