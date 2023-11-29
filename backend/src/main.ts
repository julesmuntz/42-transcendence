import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session, { MemoryStore } from "express-session";
import passport from "passport";
import express from "express";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
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
	await app.listen(3030);
}
bootstrap();
