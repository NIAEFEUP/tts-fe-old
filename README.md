# tts-fe

TimeTableSelector's Front-End, developed in Vue.js.

## What is TimeTableSelector (tts)?

TimeTableSelector is a tool for schedule planning for UPorto's students.
Check it out at https://ni.fe.up.pt!

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Build Setup (With Docker)
``` bash
#build image for development
docker-compose build

#serve with hot reload at localhost:8080
docker-compose up

#build image for production
docker build -f prod.Dockerfile -t tts-web .

#serve production content at localhost:80
docker run --name tts-web tts-web

#stop production server
docker down tts-web

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
