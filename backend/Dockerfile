FROM node:lts

RUN apt-get update -y && apt-get upgrade -y && npm install -g @nestjs/cli

WORKDIR /app

COPY package*.json .

RUN npm install && npm install --save @nestjs/typeorm typeorm pg\
	class-validator @nestjs/passport passport passport-42\
	&& npm install @types/passport-42 && npm i --save @nestjs/config\
	&& npm install @nestjs/mapped-types express-session otplib qrcode @nestjs/jwt\
	&& npm i --save class-validator class-transformer\
	&& npm install -D @types/express-session\
	&& npm install --save-dev @types/qrcode

COPY tsconfig.json .

RUN npm run build

EXPOSE 3030

CMD [ "/bin/bash", "-c", "npm run start:dev" ]
