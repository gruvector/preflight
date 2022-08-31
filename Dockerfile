FROM node:18.8-alpine3.15
WORKDIR /preflight
COPY ./docker/clone-and-preflight.js ./docker/package.json ./docker/yarn.lock ./
RUN yarn install --frozen-lockfile
RUN yarn global add @upleveled/preflight
# Allow `git clone` in the script
RUN apk add git
RUN chmod +x ./clone-and-preflight.js
ENTRYPOINT ["./clone-and-preflight.js"]
