import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session, { MemoryStore } from "express-session";
import passport from "passport";
import express from "express";
import * as cors from 'cors';

async function bootstrap() {
	var cors = require('cors');
	const app = await NestFactory.create(AppModule);
	app.use(cors({
		origin: 'http://localhost:3000'
	}));
	app.use(
		session({
			secret: process.env.SESSION_ENCRYPT,
			saveUninitialized: false,
			resave: false,
			store: new MemoryStore(),
			cookie: {
				maxAge: 24 * 60 * 60 * 1000,
			},
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.json());
	app.enableCors({
		origin: 'http://localhost:3000'
	});
	await app.listen(3030);
}
bootstrap();
