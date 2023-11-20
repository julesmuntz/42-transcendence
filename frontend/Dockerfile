FROM node:lts

RUN apt-get update -y && apt-get upgrade -y

WORKDIR /app

COPY config/package*.json .

RUN npm install && npm install -g create-react-app

COPY config/tsconfig.json .

COPY public ./public

# RUN npm run build

EXPOSE 8080

CMD [ "/bin/bash", "-c", " npm start" ]