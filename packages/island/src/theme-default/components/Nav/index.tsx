import type { NavItemWithLink } from "@/shared/types";
import { usePageData } from "../../../runtime";
import styles from "./index.module.less";
import { SwitchAppearance } from "../SwitchAppearance";

function MenuItem({ item }: { item: NavItemWithLink }) {
  return (
    <div className="text-sm font-medium mx-3">
      <a href={item.link} className={styles.link}>
        {item.text}
      </a>
    </div>
  );
}

export function Nav() {
  const { siteData } = usePageData();
  const nav = siteData?.themeConfig?.nav || [];

  return (
    <>
      <header relative="~" w="full">
        <div
          flex="~"
          items="center"
          justify="between"
          className="px-8 h-14 divider-bottom"
        >
          <div>
            <a
              href="/"
              className="w-full h-full text-1rem font-semibold flex items-center"
              hover="opacity-60"
            >
              islandjs
            </a>
          </div>
          <div flex="~">
            <div flex="~">
              {nav.map((item) => (
                <MenuItem item={item} key={item.text}></MenuItem>
              ))}
            </div>
            <div flex="~" before="menu-item-before">
              <SwitchAppearance></SwitchAppearance>
            </div>
            <div
              className={styles.socialLinkIcon}
              ml="2"
              before="menu-item-before"
            >
              <a href="/">
                <div className="i-carbon-logo-github w-5 h-5 fill-current"></div>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
