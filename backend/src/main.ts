import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {

	const app = await NestFactory.create(AppModule, { cors: true });
	// app.use(function (request: Request, response: Response, next: NextFunction) {
	// 	response.setHeader('Access-Control-Allow-Origin', 'http://${process.env.HOSTNAME}:${process.env.PORT}');
	// });
	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true
	});
	app.setGlobalPrefix('api');
	await app.listen(parseInt(`${process.env.PORT}`));
}
bootstrap();
