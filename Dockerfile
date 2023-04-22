FROM node:18-alpine
WORKDIR /preflight
COPY ./docker/clone-and-preflight.js ./docker/package.json ./docker/pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
ENV PNPM_HOME=/usr/local/bin
RUN SHELL=bash pnpm setup && source ~/.bashrc && pnpm add --global @upleveled/preflight
# Allow `git clone` in the script
RUN apk add git
RUN chmod +x ./clone-and-preflight.js
ENTRYPOINT ["./clone-and-preflight.js"]
