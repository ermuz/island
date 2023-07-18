import { createServer } from "vite";
import { resolveConfig } from "./config";
import { PACKAGE_ROOT } from "@/node/contants";
import { createVitePlugins } from "./vitePlugins";

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, "serve", "development");
  return createServer({
    root: PACKAGE_ROOT,
    plugins: await createVitePlugins(config, restartServer),
    server: {
      fs: {
        allow: [PACKAGE_ROOT],
      },
    },
  });
}
