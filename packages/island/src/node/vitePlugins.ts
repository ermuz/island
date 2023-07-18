import { pluginIndexHtml } from "@/node/plugin-island/index-html";
import pluginReact from "@vitejs/plugin-react";
import { PluginConfig } from "./plugin-island/config";
import { pluginRoutes } from "./plugin-routes/index";
import { createPluginMdx } from "./plugin-mdx";
import type { SiteConfig } from "@/shared/types";
import unocssVitePlugin from "unocss/vite";
import unocssOptions from "./unocssOptions";
import babelPluginIsland from "./babel-plugin-island";
import { PACKAGE_ROOT } from "./contants";
import { join } from "node:path";

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR: boolean = false
) {
  return [
    unocssVitePlugin(unocssOptions),

    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: "automatic",
      jsxImportSource: isSSR ? join(PACKAGE_ROOT, "src", "runtime") : "react",
      babel: {
        plugins: [babelPluginIsland],
      },
    }),
    PluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
      isSSR,
    }),
    await createPluginMdx(),
  ];
}
