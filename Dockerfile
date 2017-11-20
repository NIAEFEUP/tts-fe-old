FROM node:latest

COPY package.json package-lock.json  /usr/src/app/
WORKDIR /usr/src/app
RUN npm install

CMD npm run dev