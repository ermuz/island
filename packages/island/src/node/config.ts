import { type UserConfig, type SiteConfig } from "@/shared/types";
import { resolve } from "path";
import fs from "fs-extra";
import { loadConfigFromFile } from "vite";

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

function getUserConfigPath(root: string) {
  try {
    const supportedConfigFiles = ["config.ts", "config.js"];
    const configPath = supportedConfigFiles
      .map((item) => resolve(root, item))
      .find(fs.pathExistsSync);
    return configPath;
  } catch (e) {
    console.error("Failed to load config file");
    throw e;
  }
}

export async function resolveUserConfig(
  root: string,
  command: "serve" | "build",
  mode: "production" | "development"
) {
  // 1、获取配置文件路径 支持js、ts格式
  const configPath = getUserConfigPath(root);
  // 2. 解析配置文件
  const result = await loadConfigFromFile({ command, mode }, configPath, root);

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    // 1. object
    // 2. promise
    // 3. function
    const userConfig = (await (typeof rawConfig === "function"
      ? rawConfig()
      : rawConfig)) as UserConfig;
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

export function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || "Island",
    description: userConfig.description || "SSG Framework",
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {},
  };
}

export async function resolveConfig(
  root: string,
  command: "serve" | "build",
  mode: "production" | "development"
) {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  const siteConfig = {
    root,
    configPath,
    siteData: resolveSiteData(userConfig),
  };
  return siteConfig;
}

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}
