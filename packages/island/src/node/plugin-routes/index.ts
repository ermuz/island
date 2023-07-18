import { Plugin } from "vite";
import { RouteService } from "./RouteService";
import { PageModule } from "./../../shared/types/index";

interface PluginOptions {
  root: string;
  isSSR: boolean;
}

export interface Route {
  path: string;
  element: React.ReactNode;
  filePath: string;
  preload: () => Promise<PageModule>;
}

export const CONVENTIONAL_ROUTE_ID = "island:routes";

export function pluginRoutes(options: PluginOptions): Plugin {
  const routeService = new RouteService(options.root);
  return {
    name: CONVENTIONAL_ROUTE_ID,
    async configResolved() {
      await routeService.init();
    },
    resolveId(id) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return "\0" + CONVENTIONAL_ROUTE_ID;
      }
    },
    load(id) {
      if (id === "\0" + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRoutesCode(options.isSSR);
      }
    },
  };
}
