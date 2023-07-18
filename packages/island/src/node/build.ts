import { join, dirname, resolve } from "path";
import { build as viteBuild, type InlineConfig } from "vite";
import { type RollupOutput, type OutputChunk } from "rollup";
import fs from "fs-extra";
const { ensureDir, writeFile, remove } = fs;
// import { ensureDir, writeFile, remove } from "fs-extra";
import ora from "ora";
import { render as Render, routes as Routes } from "../runtime/server-entry";

import { resolveConfig } from "./config";
import { createVitePlugins } from "./vitePlugins";

import {
  CLIENT_ENTRY_PATH,
  MASK_SPLITTER,
  SERVER_ENTRY_PATH,
} from "@/node/contants";
import type { SiteConfig } from "@/shared/types";
import type { Route } from "./plugin-routes";
import type { RenderResult } from "@/runtime/server-entry";

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (
    isServer: boolean = false
  ): Promise<InlineConfig> => {
    return {
      mode: "production",
      plugins: await createVitePlugins(config, undefined, isServer),
      root,
      ssr: {
        noExternal: ["react-router-dom", "lodash-es"],
      },
      build: {
        minify: false,
        ssr: isServer,
        outDir: isServer ? join(root, ".temp") : join(root, "build"),
        rollupOptions: {
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: isServer ? "cjs" : "esm",
          },
        },
      },
    };
  };
  try {
    // const spinner = ora();
    // spinner.start("building client + server bundles ...\n");
    debugger;
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(await resolveViteConfig(true)),
      viteBuild(await resolveViteConfig(true)),
    ]);
    // spinner.succeed("building client + server bundles success");
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {}
}

async function bundleIslands(
  root: string,
  islandPathToMap: Awaited<ReturnType<typeof Render>>["islandToPathMap"]
) {
  debugger;
  console.log("islandPathToMap", islandPathToMap);
  const islandsInjectCode = `
  ${Object.entries(islandPathToMap)
    .map(
      ([islandName, islandPath]) => `import ${islandName} from '${islandPath}'`
    )
    .join(";")}
    window.ISLANDS = { ${Object.keys(islandPathToMap).join(", ")} };
  window.ISLAND_PROPS = JSON.parse(
    document.getElementById('island-props').textContent
  );
  `;
  const injectId = "island:inject";
  return viteBuild({
    mode: "production",
    build: {
      outDir: join(root, ".temp"),
      rollupOptions: {
        input: injectId,
      },
    },
    plugins: [
      {
        name: injectId,
        enforce: "post",
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER);
            return this.resolve(originId, importer, { skipSelf: true });
          }
          if (id === injectId) {
            return id;
          }
        },
        load(id) {
          if (id === injectId) {
            return islandsInjectCode;
          }
        },
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === "asset") {
              delete bundle[name];
            }
          }
        },
      },
    ],
  });
}

export async function renderPage(
  render: typeof Render,
  root: string,
  clientBundle: RollupOutput,
  routes: Route[]
) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  ) as OutputChunk;

  await Promise.all(
    routes.map(async (route: Route) => {
      const routePath = route.path;
      const { appHtml, islandToPathMap, islandProps } = await render(routePath);
      const islandBundle = await bundleIslands(root, islandToPathMap);
      const islandCode = (islandBundle as RollupOutput).output[0].code;
      const styleAsserts = clientBundle.output.filter(
        (chunk) => chunk.type === "asset" && chunk.fileName.endsWith(".css")
      );
      const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          ${styleAsserts
            .map(
              (style) => `<link rel="stylesheet" href="/${style.fileName}" />`
            )
            .join("\n")}
        </head>
        <body>
          <div id="root">${appHtml}</div>
          <script type="module">${islandCode}</script>
          <script src="/${clientChunk.fileName}" type="module"> </script>
          <script id="island-props">${islandCode}</script>
        </body>
      </html>
      `.trim();
      const fileName = routePath.endsWith("/")
        ? `${routePath}index.html`
        : `${routePath}.html`;
      await ensureDir(join(root, "build", dirname(fileName)));
      await writeFile(join(root, "build", fileName), html);
    })
  );
  await remove(join(root, ".temp"));
}

export async function build(root: string) {
  const config = await resolveConfig(root, "build", "production");
  debugger;
  // 1. bundle client + server
  const [clientBundle, serverBundle] = await bundle(root, config);
  // 2. 引入 server-entry.js
  const serverEntryPath = join(root, ".temp", "server-entry.cjs");
  const { render, routes }: { render: typeof Render; routes: typeof Routes } =
    await import(serverEntryPath);

  // 3. 服务端渲染，产出 html
  await renderPage(render, root, clientBundle, routes);
}
