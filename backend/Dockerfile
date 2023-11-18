FROM node:lts

RUN apt-get update -y && apt-get upgrade -y && npm install -g @nestjs/cli

WORKDIR /app

COPY config/package*.json .

RUN npm install && npm install --save @nestjs/typeorm typeorm pg

COPY config/tsconfig.json .

RUN npm run build

EXPOSE 3030

CMD [ "/bin/bash", "-c", "npm run start:dev" ]
