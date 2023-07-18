import pluginMdx from "@mdx-js/rollup";
import rehypePluginAutolinkHeadings from "rehype-autolink-headings";
import rehypePluginSlug from "rehype-slug";

import remarkPluginGFM from "remark-gfm";
import remarkPluginMDXFrontMatter from "remark-mdx-frontmatter";
import remarkPluginFrontmatter from "remark-frontmatter";
import { remarkPluginToc } from "./remarkPlugins/toc";

import { rehypePluginPreWrapper } from "./rehypePlugins/preWrapper";
import { rehypePluginSkiki } from "./rehypePlugins/shiki";
import { getHighlighter } from "shiki";

export async function pluginMdxRollup() {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginFrontmatter,
      [remarkPluginMDXFrontMatter, { name: "frontmatter" }],
      remarkPluginToc,
    ],
    rehypePlugins: [
      rehypePluginSlug,
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: "header-anchor",
          },
          content: {
            type: "text",
            value: "#",
          },
        },
      ],
      rehypePluginPreWrapper,
      [
        rehypePluginSkiki,
        { highlighter: await getHighlighter({ theme: "nord" }) },
      ],
    ],
  });
}
