TAG ?= $(shell git symbolic-ref -q --short HEAD || git describe --tags --exact-match)

build:
	docker build -t git.sberrobots.ru:8443/shuttle_system/onesimus_web/onesimus-operator-gui-front:$(TAG) .

run:
	docker run -d --rm --privileged --ipc host --network host --name wms_gui git.sberrobots.ru:8443/shuttle_system/onesimus_web/onesimus-operator-gui-front:$(TAG)

stop:
	docker stop wms_gui

pull:
	docker pull git.sberrobots.ru:8443/shuttle_system/onesimus_web/onesimus-operator-gui-front:$(TAG)