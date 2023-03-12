FROM node:19

WORKDIR /docker

COPY package*.json ./

RUN yarn

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "yarn", "start" ]
