FROM node:8.16.0-alpine as builder

WORKDIR /usr/src/app
COPY .  .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 8000:80