import fs from "node:fs";
import path from "node:path";

import { fileTypeFromBlob } from "file-type";
import type { FileTypeResult } from "file-type";
import multer from "multer";

export const permamentUploadDir = "upload/";

export const upload = multer({
	dest: "/tmp/",
});

export async function getFileType(
	file: Express.Multer.File,
): Promise<FileTypeResult | undefined> {
	const blob = await fs.openAsBlob(file.path);
	return fileTypeFromBlob(blob);
}

export async function permamentize(
	file: Express.Multer.File,
	newPath: string,
): Promise<void> {
	await fs.promises.copyFile(file.path, path.join(permamentUploadDir, newPath));
}
