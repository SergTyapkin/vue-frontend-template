-include .env


info:
	echo "------------------------------------------------------------------------------------------------------" && \
	echo "| You runs make command with no targets. You must specify target after 'make'. For example 'make all' |" && \
	echo "| Available targets: all; update; build; run; down; generate-certs; renew-certs; generate-certs; setup-ci; install-docker-if-not-exists; set-docker-not-sudo; setup-env-file." && \
	echo "------------------------------------------------------------------------------------------------------"

build:
	echo "[Make]: Running 'build' target in Makefile..." && \
  bash ./docker-deploy/scripts/build.sh
run:
	echo "[Make]: Running 'run' target in Makefile..." && \
	bash ./docker-deploy/scripts/run.sh
down:
	echo "[Make]: Running 'down' target in Makefile..." && \
  bash ./docker-deploy/scripts/down.sh

generate-certs:
	echo "[Make]: Running 'generate-certs' target in Makefile..." && \
  bash ./docker-deploy/scripts/generate-certs.sh
renew-certs:
	echo "[Make]: Running 'renew-certs' target in Makefile..." && \
  cd docker-deploy && \
  docker compose run --rm certbot renew
setup-auto-renewing-certs:
	echo "[Make]: Running 'setup-auto-renewing-certs' target in Makefile..." && \
	bash ./docker-deploy/scripts/setup-auto-renewing-certs.sh

setup-ci:
	echo "[Make]: Running 'setup-ci' target in Makefile..." && \
  bash ./docker-deploy/scripts/setup-ci.sh && \
	bash ./docker-deploy/scripts/show-variables-to-github-ci.sh

install-docker-if-not-exists:
	echo "[Make]: Running 'install-docker-if-not-exists' target in Makefile..." && \
    bash ./docker-deploy/scripts/install-docker-if-not-exists.sh

set-docker-not-sudo:
	echo "[Make]: Running 'set-docker-not-sudo' target in Makefile..." && \
  bash ./docker-deploy/scripts/set-docker-not-sudo.sh

setup-env-file:
	echo "[Make]: Running 'setup-env-file' target in Makefile..." && \
  bash ./docker-deploy/scripts/setup-env-file.sh

setup-docker-compose:
	echo "[Make]: Running 'setup-docker-compose' target in Makefile..." && \
  bash ./docker-deploy/scripts/setup-docker-compose.sh

update:
	echo "[Make]: Running 'update' target in Makefile..." && \
	make setup-docker-compose && \
  bash ./docker-deploy/scripts/update-deploy.sh

all:
	echo "[Make]: Running 'all' target in Makefile..." && \
  make install-docker-if-not-exists
	make setup-env-file
	make setup-docker-compose
	make generate-certs
	make setup-auto-renewing-certs
	make down
	make setup-ci
	make update
