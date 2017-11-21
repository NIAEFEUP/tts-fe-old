FROM node:latest

COPY package.json package-lock.json  /usr/src/app/
WORKDIR /usr/src/app
RUN npm install

EXPOSE 8080

CMD npm run dev