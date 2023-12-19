FROM node:lts

RUN apt-get update -y && apt-get upgrade -y

WORKDIR /app

COPY package*.json .

RUN npm install && npm install -g create-react-app && npm install socket.io-client && npm install @tanstack/react-location && npm install react-query && npm install axios

RUN npm install react-bootstrap bootstrap react-router-dom bootstrap-icons react-bootstrap-icons js-cookie @types/js-cookie jwt-decode styled-components

COPY tsconfig.json .

COPY public ./public

# RUN npm run build

EXPOSE 3000

CMD [ "/bin/bash", "-c", " npm start" ]
