import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagePath = path.join(__dirname, "../package.json");
const outputPath = path.join(__dirname, "../data/app-info.ts"); // adjust path as needed

const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));

const content = `// This file is auto-generated. Do not edit.
export const version = '${pkg.version}';
export const name = '${pkg.name}';
`;

fs.writeFileSync(outputPath, content);
console.log("Generated app-info.js successfully.");
