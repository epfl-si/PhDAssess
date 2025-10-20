## Setup a meteor image in production mode
#
ARG BASE_IMAGE=node:22-trixie

FROM $BASE_IMAGE AS build

# Install meteor
RUN npx meteor

ENV NODE_ENV=production
# to ignore caniuse-lite outdated warning
ENV BROWSERSLIST_IGNORE_OLD_DATA=1

ENV PATH=$PATH:/root/.meteor
ENV METEOR_ALLOW_SUPERUSER=1

WORKDIR /app

COPY package.json package-lock.json ./
RUN mkdir patches
# The other patches are dev-only (pending a released fix to meteor/meteor#13504):
COPY patches/@grpc* patches/
RUN meteor npm install --production

COPY . .

RUN mkdir packages
WORKDIR /app/packages
ARG EPFL_ACCOUNTS_ENTRA_BUILD_BRANCH=
ARG EPFL_ENTRA_OAUTH_BUILD_BRANCH=
ENV EPFL_ACCOUNTS_ENTRA_BUILD_BRANCH=$EPFL_ACCOUNTS_ENTRA_BUILD_BRANCH
ENV EPFL_ENTRA_OAUTH_BUILD_BRANCH=$EPFL_ENTRA_OAUTH_BUILD_BRANCH
RUN set -e -x; if [ -n "$EPFL_ACCOUNTS_ENTRA_BUILD_BRANCH" ]; then \
      git clone --branch "$EPFL_ACCOUNTS_ENTRA_BUILD_BRANCH" https://github.com/epfl-si/meteor-account-entra accounts-entra ; \
      cd accounts-entra ; git rev-parse HEAD ; \
    fi
RUN set -e -x; if [ -n "$EPFL_ENTRA_OAUTH_BUILD_BRANCH" ]; then \
      git clone --branch "$EPFL_ENTRA_OAUTH_BUILD_BRANCH" https://github.com/epfl-si/meteor-entra-auth entra-oauth ; \
      cd entra-oauth ; git rev-parse HEAD ; \
    fi
WORKDIR /app

RUN meteor build --directory /built-app
RUN cd /built-app/bundle/programs/server && meteor npm install --production

FROM $BASE_IMAGE

ENV NODE_ENV=production
COPY --from=build /built-app/bundle /app
WORKDIR /app

# Provide bundled protobufs for zeebe-node... Kind of
RUN mkdir /proto
RUN ln -s /app/programs/server/npm/node_modules/zeebe-node/proto/*.proto /proto/

CMD ["node", "main.js"]
