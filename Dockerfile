FROM node:alpine

WORKDIR /usr/src/app

RUN apk update && \
    apk add --update git

RUN git clone https://github.com/sistemas-distribuidos-st/Lab3-MainServer

WORKDIR /usr/src/app/Lab3-MainServer

RUN npm install

CMD [ "node", "index.js" ]
