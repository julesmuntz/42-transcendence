FROM node:lts

RUN apt-get update -y && apt-get upgrade -y

WORKDIR /app

COPY config/package*.json .

RUN npm install && npm install -g create-react-app && npm install socket.io-client

RUN npm install react-bootstrap bootstrap react-router-dom bootstrap-icons react-bootstrap-icons

COPY config/tsconfig.json .

COPY public ./public

# RUN npm run build

EXPOSE 3000

CMD [ "/bin/bash", "-c", " npm start" ]
