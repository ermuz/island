import fg from "fast-glob";
import { relative } from "path";
import { normalizePath } from "vite";

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}
export class RouteService {
  #scanDir: string;
  #routeData: Array<RouteMeta> = [];
  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }
  async init() {
    const files = fg
      .sync(["**/*.{js,jsx,ts,tsx,md,mdx}"], {
        cwd: this.#scanDir,
        absolute: true,
        ignore: ["**/build/**", "**/.island/**", "config.ts"],
      })
      .sort();
    files.forEach((file) => {
      const fileRelativePath = normalizePath(relative(this.#scanDir, file));
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.#routeData.push({
        routePath,
        absolutePath: file,
      });
    });
  }
  normalizeRoutePath(raw: string) {
    const routePath = raw.replace(/\.(.*)?$/, "").replace(/index$/, "");
    return routePath.startsWith("/") ? routePath : `/${routePath}`;
  }
  getRouteData(): Array<RouteMeta> {
    return this.#routeData;
  }

  generateRoutesCode(ssr: boolean) {
    return `
    import React from 'react';
    ${ssr ? "" : `import loadable from '@loadable/component';`}


    ${this.#routeData
      .map((route, index) =>
        ssr
          ? `import Route${index} from '${route.absolutePath}'`
          : `const Route${index} = loadable(() => import('${route.absolutePath}'));`
      )
      .join("\n")}
    export const routes = [
      ${this.#routeData
        .map((route, index) => {
          return `{ path: '${route.routePath}', element: React.createElement(Route${index}),preload: () => import('${route.absolutePath}') }`;
        })
        .join(",\n")}
    ];
    `;
  }
}
