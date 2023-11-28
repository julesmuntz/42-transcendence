import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session, { MemoryStore } from "express-session";
import passport from "passport";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(
		session({
			secret: process.env.SESSION_ENCRYPT,
			saveUninitialized: false,
			resave: false,
			store: new MemoryStore(),
			cookie: {
				maxAge: 60000,
			},
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());
	await app.listen(3030);
}
bootstrap();
