ARG BASE_IMAGE=quay-its.epfl.ch/svc1394/ubuntu-node-14:latest

# Stage 1: Base Environment
FROM $BASE_IMAGE AS base-stage

RUN groupadd -g 1001 meteoruser && \
    useradd -u 1001 -g meteoruser -m -s /bin/bash meteoruser && \
    mkdir -p /app/.meteor/local /app/output && \
    chown -R meteoruser:meteoruser /app

USER meteoruser
# Install meteor
RUN npx meteor

ENV NODE_ENV=production
# to ignore caniuse-lite outdated warning
ENV BROWSERSLIST_IGNORE_OLD_DATA=1
## Update PATH for the `meteoruser` user to be able to user the command 'meteor'
ENV PATH=$PATH:/home/meteoruser/.meteor/

# Stage 2: Build
FROM base-stage AS build-stage

WORKDIR /app

COPY --chown=meteoruser:meteoruser package.json package-lock.json ./
RUN meteor npm install --omit=dev

COPY --chown=meteoruser:meteoruser . .
RUN meteor build --directory /app/output && \
    meteor npm run postinstall

# Stage 3: Final Runtime Image
FROM $BASE_IMAGE

RUN groupadd -g 1001 meteoruser && \
    useradd -u 1001 -g meteoruser -m -s /bin/bash meteoruser

WORKDIR /app
COPY --chown=meteoruser:meteoruser --from=build-stage /app/output/bundle /app
RUN cd /app/programs/server && npm install --omit=dev

USER meteoruser
CMD ["node", "main.js"]
