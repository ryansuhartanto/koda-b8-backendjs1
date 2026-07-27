import { app } from "./app.ts";

const port = Number(process.env["PORT"] ?? 3000);
app.listen(port, () => {
	// oxlint-disable-next-line no-console
	console.log(`listening on http://localhost:${port}`);
});
