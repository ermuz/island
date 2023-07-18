import { Layout } from "../theme-default";
import { matchRoutes } from "react-router-dom";
import { routes } from "island:routes";
import type { PageData } from "@/shared/types";
import siteData from "island:site-data";

export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath);
  if (matched) {
    const moduleInfo = await matched[0].route.preload();
    return {
      siteData,
      pageType: moduleInfo.frontmatter?.pageType ?? "doc",
      pagePath: routePath,
      frontmatter: moduleInfo.frontmatter,
      toc: moduleInfo.toc,
    };
  }
  return {
    siteData,
    pageType: "404",
    pagePath: routePath,
    frontmatter: {},
    toc: [],
  };
}

export function App() {
  return <Layout />;
}
