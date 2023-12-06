import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session, { MemoryStore } from "express-session";
import passport from "passport";
import express, { NextFunction, Request, Response } from "express";
import * as cors from 'cors';

async function bootstrap() {
	// var cors = require('cors');

	const app = await NestFactory.create(AppModule, {cors: true});
	// app.use(function (request: Request, response: Response, next: NextFunction) {
	// 	response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	// });
	await app.listen(3030);
}
bootstrap();
