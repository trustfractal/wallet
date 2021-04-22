FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn backend:build

EXPOSE 3000

CMD ["yarn", "backend:start"]
