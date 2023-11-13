FROM node:latest

RUN apt-get update -y && apt-get upgrade -y

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
