import { Controller, Get, UseGuards, Req, Post, Body, UnauthorizedException, HttpCode, Redirect } from "@nestjs/common";
import { FortyTwoAuthGuard } from "./utils/Guards";
import { Request } from "express";

@Controller("auth")
export class AuthController {
	@Get("login")
	@UseGuards(FortyTwoAuthGuard)
	getLogin() {
		return { msg: "You will be redirected" };
	}

	@Get("callback")
	@Redirect("http://localhost:3000")
	@UseGuards(FortyTwoAuthGuard)
	getRedirect() {
		return { msg: "User connected, you will be redirected" };
	}

	@Get("status")
	user(@Req() request: Request) {
		// console.log(request.user);
		if (request.user) return { msg: "Authenticated" };
		else return { msg: "Not authenticated" };
	}
}
