FROM node:26

WORKDIR /docker

COPY package*.json ./
COPY tools/eslint-config/package.json ./tools/eslint-config/

RUN yarn

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "yarn", "start" ]
