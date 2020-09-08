FROM node:8.16.0-alpine

WORKDIR /usr/src/app
COPY package.json package-lock.json  ./
RUN npm install

EXPOSE 8080

CMD npm run dev
