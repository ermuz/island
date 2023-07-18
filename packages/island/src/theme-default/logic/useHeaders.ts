import { Header } from "@/shared/types";
import { useEffect, useState } from "react";

export function useHeaders(initHeaders: Header[]) {
  const [headers, setHeader] = useState(initHeaders);

  useEffect(() => {
    // dev 更新 toc
    if (import.meta.env.DEV) {
      import.meta.hot.on("mdx-changed", ({ filePath }) => {
        import(/* @vite-ignore */ `${filePath}?import&t=${Date.now()}`).then(
          (module) => {
            setHeader(module.toc);
          }
        );
      });
    }
  }, []);
  return headers;
}
