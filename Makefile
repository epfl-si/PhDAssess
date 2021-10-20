DOCKER_BASE_IMAGE := ubuntu
DOCKER_BASE_TAG := focal
OPENSHIFT_BUILD_NAMESPACE := phd-assess

.PHONY: build
build:
	docker build -t docker-registry.default.svc:5000/$(OPENSHIFT_BUILD_NAMESPACE)/meteor-mongo-base:latest meteor-mongo-base/
	docker build -t docker-registry.default.svc:5000/$(OPENSHIFT_BUILD_NAMESPACE)/phd-assess-meteor:latest .
