import { type ComponentType } from "react";
import { type UserConfig as ViteConfiguration } from "vite";

export interface NavItemWithLink {
  text: string;
  link: string;
}

export interface SidebarItem {
  text: string;
  link: string;
}

export interface SidebarGroup {
  text: string;
  items: SidebarItem[];
}

export interface Sidebar {
  [path: string]: SidebarGroup[];
}

export interface Footer {
  message: string;
}

export interface ThemeConfig {
  nav?: NavItemWithLink[];
  sidebar?: Sidebar;
  footer?: Footer;
}

export interface UserConfig {
  title?: string;
  description?: string;
  themeConfig?: ThemeConfig;
  vite?: ViteConfiguration;
}

export interface SiteConfig {
  root: string;
  configPath: string;
  siteData: UserConfig;
}

type PageType = "home" | "doc" | "custom" | "404";

export interface Header {
  id: string;
  text: string;
  depth: number;
}

export interface Feature {
  icon: string;
  title: string;
  details: string;
}

export interface Hero {
  name: string;
  text: string;
  tagline: string;
  image?: {
    src: string;
    alt: string;
  };
  actions: {
    text: string;
    link: string;
    theme: "brand" | "alt";
  }[];
}

export interface FrontMatter {
  title?: string;
  description?: string;
  pageType?: PageType;
  sidebar?: boolean;
  outline?: boolean;
  // 增加 features 和 hero 的类型
  features?: Feature[];
  hero?: Hero;
}

export interface PageData {
  siteData: UserConfig;
  pagePath: string;
  pageType: PageType;
  toc?: Header[];
  frontmatter: FrontMatter;
}

export interface PageModule {
  default: ComponentType;
  frontmatter?: FrontMatter;
  toc: Header[];
  [key: string]: unknown;
}

export type PropsWithIsland<T> = T & { __island?: boolean };
