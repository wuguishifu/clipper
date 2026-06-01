FROM node:22-slim AS build_image

LABEL maintainer="Bo Bramer <bramer.bo@gmail.com>"
LABEL org.opencontainers.image.source=https://github.com/wuguishifu/clipper

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_INTEGRITY_KEYS="0"
RUN corepack enable

WORKDIR /app

COPY . ./

ARG GPG_PASSPHRASE
ARG BUILD_ENV
ARG VERSION

ENV VERSION=${VERSION}

RUN pnpm install --frozen-lockfile

RUN NX_DAEMON=false ENVIRONMENT=$BUILD_ENV pnpm nx build saturn

# remove development dependencies
RUN npm prune --production --legacy-peer-deps

FROM node:22-slim

ARG VERSION
ARG BUILD_ENV
ENV VERSION=${VERSION}
ENV ENVIRONMENT=${BUILD_ENV}

COPY --from=build_image /app/dist/apps/saturn ./dist
COPY --from=build_image /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]
