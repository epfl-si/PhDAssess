ARG BASE_IMAGE=camunda/zeebe:8.5.16

FROM $BASE_IMAGE

USER root

RUN apt-get update && \
    apt-get install -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN wget -O /usr/local/zeebe/lib/zeebe-hazelcast-exporter-1.4.0-jar-with-dependencies.jar https://github.com/camunda-community-hub/zeebe-hazelcast-exporter/releases/download/1.4.0/zeebe-hazelcast-exporter-1.4.0-jar-with-dependencies.jar

RUN chmod 755 /usr/local/zeebe/lib/*jar

USER 1001:1001

COPY application.yaml /usr/local/zeebe/config/application.yaml
