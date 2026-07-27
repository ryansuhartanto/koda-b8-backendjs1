import http2 from "node:http2";

import type { RequestHandler } from "express";

import * as User from "../models/user.ts";

export const getAll: RequestHandler = (_req, res) => {
	res.json(User.findAll());
};

export const getId: RequestHandler<{ id: number }> = (req, res) => {
	const user = User.findById(req.params.id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	res.json(user);
};

export const post: RequestHandler = (req, res) => {
	const { name, email, password } = req.body as Partial<User.User>;

	if (!name || !email || !password) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "name, email and password are required" });
		return;
	}

	if (User.findId(email) !== -1) {
		res
			.status(http2.constants.HTTP_STATUS_CONFLICT)
			.json({ error: "email already registered" });
		return;
	}

	res
		.status(http2.constants.HTTP_STATUS_CREATED)
		.json(User.create({ name, email, password }));
};

export const patch: RequestHandler<{ id: number }> = (req, res) => {
	const { id } = req.params;
	const user = User.findById(id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	const mod = req.body as Partial<User.User>;

	res.json(User.edit(id, mod));
};

export const del: RequestHandler<{ id: number }> = (req, res) => {
	const { id } = req.params;
	const user = User.findById(id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	User.remove(id);

	res.json();
};
