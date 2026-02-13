## Setup a meteor image in production mode
#
ARG BASE_IMAGE=node:22-trixie

FROM $BASE_IMAGE AS build

RUN npx meteor

ENV PATH=$PATH:/root/.meteor
ENV METEOR_ALLOW_SUPERUSER=true

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN meteor npm install

RUN set -e -x; mkdir /app; meteor build --directory /app; \
    cd /app/bundle/programs/server ; meteor npm install --production

FROM $BASE_IMAGE

ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app/bundle

# Provide bundled protobufs for zeebe-node... Kind of
RUN mkdir /proto
RUN ln -s /app/bundle/programs/server/npm/node_modules/zeebe-node/proto/*.proto /proto/

CMD ["node", "main.js"]
