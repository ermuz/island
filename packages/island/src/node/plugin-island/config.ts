import { type SiteConfig } from "@/shared/types";
import { join, relative } from "path";
import { type Plugin } from "vite";
import { RUNTIME_PATH } from "@/node/contants";
import sirv from "sirv";

const SITE_DATA_ID = "island:site-data";

export function PluginConfig(
  config: SiteConfig,
  restart?: () => Promise<void>
): Plugin {
  return {
    name: "island:config",
    config() {
      return {
        resolve: {
          alias: {
            "@runtime": RUNTIME_PATH,
          },
        },
        css: {
          modules: {
            localsConvention: "camelCaseOnly",
          },
        },
      };
    },
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return "\0" + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === "\0" + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    async handleHotUpdate(ctx) {
      const customWatchFiles = [config.configPath];
      const include = (id: string) =>
        customWatchFiles.some((file) => id.includes(file));
      if (include(ctx.file)) {
        await restart();
        console.log(
          `\n${relative(config.root, ctx.file)} changed restarting server`
        );
      }
    },
    configureServer(server) {
      const publicDir = join(config.root, "public");
      server.middlewares.use(sirv(publicDir));
    },
  };
}
