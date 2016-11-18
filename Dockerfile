FROM node:latest
COPY . /src
WORKDIR /src
CMD npm install && npm start