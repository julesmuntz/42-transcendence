import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
    async canActivate(context: ExecutionContext) {
		// console.log("Start of FortyTwoAuthGuard canActivate");
		const activate = (await super.canActivate(context)) as boolean;
		// console.log("Activate: ", activate);
		const request = context.switchToHttp().getRequest();
		// console.log("Inside FortyTwoAuthGuard");
		// console.log("Request User: ", request.user);
		await super.logIn(request);
        return true;
    }

}

