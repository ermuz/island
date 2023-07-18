import { usePageData, Content } from "../../../runtime";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../../components/SideBar";
import style from "./index.module.less";
import { DocFooter } from "../../components/DocFooter";
import { Aside } from "../../components/Aside";

export function DocLayout() {
  const { siteData, toc } = usePageData();
  const sidebarData = siteData.themeConfig?.sidebar || {};
  const { pathname } = useLocation();
  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });

  const matchedSidebar = sidebarData[matchedSidebarKey] || [];

  return (
    <div>
      <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
      <div className={style.content} flex="~">
        <div className={style.docContent}>
          <div className="island-doc">
            <Content></Content>
          </div>
          <DocFooter></DocFooter>
        </div>
        <div className={style.asideContainer}>
          <Aside headers={toc} __island></Aside>
        </div>
      </div>
    </div>
  );
}
