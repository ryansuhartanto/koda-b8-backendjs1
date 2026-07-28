import cors from "cors";

export const corsMiddleware = cors({
	origin: ["http://localhost:5173"],
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
	allowedHeaders: ["Origin", "Content-Type", "Content-Length", "Authorization"],
});
