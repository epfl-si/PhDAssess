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
RUN meteor npm install --omit=dev

COPY . .
RUN meteor build --directory /built-app

FROM $BASE_IMAGE

COPY --from=build /built-app/bundle /app
WORKDIR /app

CMD ["node", "main.js"]
