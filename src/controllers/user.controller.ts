import http2 from "node:http2";

import type { RequestHandler } from "express";
// oxlint-disable-next-line import/no-empty-named-blocks unicorn/require-module-specifiers
import type {} from "multer";

import { getFileType, permamentize } from "#/lib/upload";
import * as User from "#/models/user.model";

type getAllRequest = {
	page: number;
	limit: number;
	q?: string;
};

type idParams = {
	id: string;
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

export const getId: RequestHandler<idParams> = async (req, res) => {
	const id = Number(req.params.id);
	const user = await User.findById(id);

	if (!id) {
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

export const patch: RequestHandler<idParams> = async (req, res) => {
	const id = Number(req.params.id);
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

export const putAvatar: RequestHandler<idParams> = async (req, res) => {
	const id = Number(req.params.id);
	const user = await User.findById(id);

	if (!user) {
		res
			.status(http2.constants.HTTP_STATUS_NOT_FOUND)
			.json({ error: "user not found" });
		return;
	}

	if (!req.file) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "file is required" });
		return;
	}

	const fileType = await getFileType(req.file);

	if (!fileType) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "unknown file" });
		return;
	}

	if (req.file.mimetype !== fileType.mime) {
		res
			.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
			.json({ error: "wrong mime type" });
	}

	const newPath = `avatar/${id}.${fileType.ext}`;

	await permamentize(req.file, newPath);
	res.json(await User.edit(id, { avatar: newPath }));
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
