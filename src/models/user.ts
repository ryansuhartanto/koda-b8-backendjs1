export type User = {
	name: string;
	email: string;
	password: string;
};

const users: User[] = [
	{ name: "John Doe", email: "john@example.com", password: "123" },
	{ name: "Jane Doe", email: "jane@example.com", password: "123" },
];

export function findAll(): User[] {
	return users;
}

export function findById(id: number): User | undefined {
	return users[id];
}

export function findId(email: string): number {
	return users.findIndex((user) => user.email === email);
}

export function create(user: User): User {
	users.push(user);
	return user;
}

export function edit(id: number, user: Partial<User>): User {
	const old: User = users[id]!;
	const mod = {
		...old,
		...user,
	};
	users[id] = mod;
	return users[id];
}

export function remove(id: number): void {
	// oxlint-disable-next-line typescript/no-dynamic-delete
	delete users[id];
}
