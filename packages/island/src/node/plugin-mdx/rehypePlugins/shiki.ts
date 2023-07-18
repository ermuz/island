import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Element, Root, Text } from "hast";
import { type Highlighter } from "shiki";
import { fromHtml } from "hast-util-from-html";

interface PluginOptions {
  highlighter: Highlighter;
}

export const rehypePluginSkiki: Plugin<[PluginOptions], Root> = ({
  highlighter,
}) => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "pre" &&
        node.children?.[0].type === "element" &&
        node.children[0].tagName === "code"
      ) {
        const codeNode = node.children[0];
        const codeContent = (codeNode.children[0] as Text).value;
        const codeClassName = codeNode.properties?.className.toString() || "";
        const lang = codeClassName.split("-")[1];
        if (!lang) return;
        const highlighterCode = highlighter.codeToHtml(codeContent, { lang });
        const fragmentAst = fromHtml(highlighterCode, { fragment: true });
        parent.children.splice(index, 1, ...fragmentAst.children);
        // const fragment = fromHtml(codeNode)
      }
    });
  };
};
