FROM node:18.10-alpine3.15
WORKDIR /preflight
COPY ./docker/clone-and-preflight.js ./docker/package.json ./docker/pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
RUN pnpm setup && pnpm add --global @upleveled/preflight
# Allow `git clone` in the script
RUN apk add git
RUN chmod +x ./clone-and-preflight.js
ENTRYPOINT ["./clone-and-preflight.js"]
