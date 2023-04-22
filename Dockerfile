FROM node:18-alpine

WORKDIR /preflight

COPY ./docker/clone-and-preflight.js ./docker/package.json ./docker/pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Enable `pnpm add --global` on Alpine Linux
# - Set the home location environment variable to a location already in $PATH
# - Trick pnpm into thinking that bash is available (only /bin/sh available on Alpine Linux)
# https://github.com/pnpm/pnpm/issues/784#issuecomment-1518582235
ENV PNPM_HOME=/usr/local/bin
RUN SHELL=bash pnpm setup

RUN pnpm add --global @upleveled/preflight

# Allow `git clone` in the script
RUN apk add git

RUN chmod +x ./clone-and-preflight.js
ENTRYPOINT ["./clone-and-preflight.js"]
