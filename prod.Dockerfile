FROM node:latest as builder

COPY .  /usr/src/app/
WORKDIR /usr/src/app
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80