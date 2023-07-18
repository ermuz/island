import type { Plugin } from "vite";
import { readFile } from "fs/promises";
import { DEFAULT_TEMPLATE_PATH, CLIENT_ENTRY_PATH } from "@/node/contants";

export function pluginIndexHtml(): Plugin {
  return {
    name: "island:index-html",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`,
            },
            injectTo: "body",
          },
        ],
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 1. 读取 template.html 的内容
          let content = await readFile(DEFAULT_TEMPLATE_PATH, "utf-8");
          // 2. 响应 html 的内容给浏览器

          content = await server.transformIndexHtml(
            req.url,
            content,
            req.originalUrl
          );
          res.setHeader("Content-Type", "text/html");
          res.end(content);
        });
      };
    },
  };
}
