ARG BASE_IMAGE=camunda/zeebe:8.5.17

FROM $BASE_IMAGE

USER root

RUN apt-get update && \
    apt-get install -y unzip wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN wget -O /tmp/zeebe-redis-exporter-1.0.3.zip https://github.com/camunda-community-hub/zeebe-redis-exporter/releases/download/1.0.3/zeebe-redis-exporter-1.0.3.zip

RUN unzip -j /tmp/zeebe-redis-exporter-1.0.3.zip "target/nexus-staging/deferred/io/zeebe/redis/zeebe-redis-exporter/1.0.3/zeebe-redis-exporter-1.0.3-jar-with-dependencies.jar" -d /usr/local/zeebe/lib

RUN chmod 755 /usr/local/zeebe/lib/*jar

USER 1001:1001

COPY application.yaml /usr/local/zeebe/config/application.yaml
