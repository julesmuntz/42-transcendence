import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session, { MemoryStore } from "express-session";
import passport from "passport";
import express from "express";
import * as cors from 'cors';

async function bootstrap() {
	var cors = require('cors');
	const app = await NestFactory.create(AppModule);

	await app.listen(3030);
}
bootstrap();
