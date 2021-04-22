FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN npm install -g yarn
RUN yarn install
RUN yarn backend:build

EXPOSE 3000

CMD ["yarn", "backend:start"]
