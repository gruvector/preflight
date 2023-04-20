FROM node:18.10-alpine3.15
WORKDIR /preflight
COPY ./docker/clone-and-preflight.js ./docker/package.json ./docker/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm add --global @upleveled/preflight
# Allow `git clone` in the script
RUN apk add git
RUN chmod +x ./clone-and-preflight.js
ENTRYPOINT ["./clone-and-preflight.js"]
