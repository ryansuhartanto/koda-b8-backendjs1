import http2 from "node:http2";

import type { RequestHandler } from "express";

import * as User from "#/models/user.model";

type getAllRequest = {
	page: number;
	limit: number;
	q?: string;
};

const getAllRequestDefault: getAllRequest = {
	page: 1,
	limit: 10,
};

export const getAll: RequestHandler = async (req, res) => {
	const { page, limit, q } = {
		...getAllRequestDefault,
		...(req.body as Partial<getAllRequest>),
	};

	const offset = (page - 1) * limit;

	res.json(await User.findAll(offset, limit, q));
};

export const getId: RequestHandler<{ id: number }> = async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	res.json(user);
};

export const post: RequestHandler = async (req, res) => {
	const { name, email, password } = req.body as Partial<User.User>;

	if (!name || !email || !password) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "name, email and password are required" });
		return;
	}

	if ((await User.findId(email)) !== -1) {
		res
			.status(http2.constants.HTTP_STATUS_CONFLICT)
			.json({ error: "email already registered" });
		return;
	}

	res
		.status(http2.constants.HTTP_STATUS_CREATED)
		.json(await User.create({ name, email, password }));
};

export const patch: RequestHandler<{ id: number }> = async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	const mod = req.body as Partial<User.User>;

	res.json(await User.edit(id, mod));
};

export const del: RequestHandler<{ id: number }> = async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	await User.remove(id);

	res.json();
};
