FROM node:18
EXPOSE 3333
WORKDIR /app
VOLUME /app
CMD npm i && node ace migration:run && node ace serve --watch