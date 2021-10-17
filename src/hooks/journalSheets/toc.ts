import { data } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/module.mjs";
import { getTextNodes, htmlToElement, replaceTextContent } from "../../library/text";

export const renderToc = (element: HTMLElement | null): void => {
    if (!element) return;
    const tocRexExp = new RegExp("\\[toc\\]", "gi");

    const textNodes = getTextNodes(element);
    replaceTextContent(textNodes, tocRexExp, (_): HTMLElement => {
        const headlineTags = ["h1", "h2", "h3", "h4", "h5", "h6"];

        const getLevel = (tag: string): number => {
            return parseInt(tag.substr(1, 1), 10);
        };

        const iterator = document.createNodeIterator(element, NodeFilter.SHOW_ELEMENT);
        let htmlString = `<div class="wjh-toc"><h3>Table of Content</h3><hr/>`;
        let lastLevel = 0;
        let currentNode;
        let openUls = 0;
        const idPrefix = "wjh-toc";
        const headlines: { level: number; text: string }[] = [];
        while ((currentNode = iterator.nextNode())) {
            if (currentNode instanceof HTMLElement && headlineTags.includes(currentNode.tagName.toLowerCase())) {
                if (!currentNode.id) {
                    currentNode.id = idPrefix + "_" + Math.random().toString(36).substr(2, 9);
                }

                const level = getLevel(currentNode.tagName);

                headlines.push({ level: level, text: currentNode.textContent ?? "" });

                if (level > lastLevel) {
                    openUls++;
                    htmlString = `${htmlString}<ul>`;
                }

                htmlString = `${htmlString}<li data-id="${currentNode.id}">${currentNode.textContent}</li>`;

                if (level < lastLevel) {
                    openUls--;
                    htmlString = `${htmlString}</ul>`;
                }
                lastLevel = level;
            }
        }

        for (let i = 0; i < openUls; i++) {
            htmlString = `${htmlString}</ul>`;
        }
        htmlString = `${htmlString}</div>`;

        const tocElement = htmlToElement(htmlString);
        tocElement.addEventListener("click", (ev) => {
            console.log(ev);
            if (!ev.target) return;
            const dataId = (ev.target as HTMLElement).dataset.id;
            if (dataId && dataId.substr(0, idPrefix.length) == idPrefix) {
                const headline = document.querySelector("#" + dataId);
                headline?.scrollIntoView();
            }
        });
        return tocElement;
    });
};
