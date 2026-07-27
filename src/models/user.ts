import fs from "node:fs/promises";

export type User = {
	name: string;
	email: string;
	password: string;
};

const file = "data.json";
async function read(): Promise<User[]> {
	const content = await fs.readFile(file, { encoding: "utf8" });
	return JSON.parse(content) as User[];
}
async function write(data: User[]) {
	const content = JSON.stringify(data, undefined, "\t");
	await fs.writeFile(file, content, { encoding: "utf8" });
}

export async function findAll(): Promise<User[]> {
	const data = await read();
	return data;
}

export async function findById(id: number): Promise<User | undefined> {
	const data = await read();
	return data[id];
}

export async function findId(email: string): Promise<number> {
	const data = await read();
	return data.findIndex((user) => user.email === email);
}

export async function create(user: User): Promise<User> {
	const data = await read();
	data.push(user);
	await write(data);
	return user;
}

export async function edit(id: number, user: Partial<User>): Promise<User> {
	const data = await read();
	data[id] = {
		...data[id]!,
		...user,
	};
	await write(data);
	return data[id];
}

export async function remove(id: number): Promise<void> {
	const data = await read();
	data.splice(id, 1);
	await write(data);
}
