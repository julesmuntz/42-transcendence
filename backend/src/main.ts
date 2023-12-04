import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session, { MemoryStore } from "express-session";
import passport from "passport";
import express from "express";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	await app.listen(3030);
}
bootstrap();
