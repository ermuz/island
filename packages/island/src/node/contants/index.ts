import { join, dirname } from "path";
import { fileURLToPath } from "node:url";

export const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export const RUNTIME_PATH = join(PACKAGE_ROOT, "src", "runtime");

export const DEFAULT_TEMPLATE_PATH = join(PACKAGE_ROOT, "template.html");

export const CLIENT_ENTRY_PATH = join(RUNTIME_PATH, "client-entry.tsx");
export const SERVER_ENTRY_PATH = join(RUNTIME_PATH, "server-entry.tsx");
export const MASK_SPLITTER = "!!ISLAND!!";
