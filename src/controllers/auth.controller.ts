import http2 from "node:http2";

import type { RequestHandler } from "express";

import * as User from "#/models/user.model";

type loginRequest = {
	email: string;
	password: string;
};

export const login: RequestHandler = async (req, res) => {
	const { email, password } = req.body as Partial<loginRequest>;

	if (!email || !password) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "email and password are required" });
		return;
	}

	const id = await User.findId(email);

	if (!id) {
		res
			.status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
			.json({ error: "email is not registered" });
		return;
	}

	const user = (await User.findById(id))!;

	if (user.password !== password) {
		res
			.status(http2.constants.HTTP_STATUS_UNAUTHORIZED)
			.json({ error: "email is not registered" });
		return;
	}

	res.json(user);
};
