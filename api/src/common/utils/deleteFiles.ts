import { FileObject } from "../types";
import fsSync from "fs";
import fsPromises from "fs/promises";

export default async function deleteFiles(files: Express.Multer.File[] | Express.Multer.File | FileObject | FileObject[]) {

    const fileArray: any = [];

    // Recursive helper to flatten arrays and objects
    const flattenFiles = (input: any) => {
        if (!input) return;
        if (Array.isArray(input)) {
            input.forEach(flattenFiles);
        } else if (typeof input === "object" && input.path) {
            fileArray.push(input);
        } else if (typeof input === "object") {
            Object.values(input).forEach(flattenFiles);
        } else {
            console.warn("Invalid file entry:", input);
        }
    };

    flattenFiles(files);

    await Promise.all(
        fileArray.map(async (file: any) => {
            try {
                if (!file.path) {
                    console.log("Missing file path")
                    return;
                }

                if (fsSync.existsSync(file.path)) {
                    await fsPromises.unlink(file.path);
                } else {
                    console.log(`${file.path} does not exist`);
                }
            } catch (err) {
                console.log(err)
            }
        })
    );
}