import fs from "node:fs";
import path from "node:path";

import { fileTypeFromBlob } from "file-type";
import type { FileTypeResult } from "file-type";
import multer from "multer";

export const permamentUploadDir = "upload/";

export function getPermamentPath(p: string): string {
	return path.join(permamentUploadDir, p);
}

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
	await fs.promises.copyFile(file.path, getPermamentPath(newPath));
	await fs.promises.rm(file.path);
}
