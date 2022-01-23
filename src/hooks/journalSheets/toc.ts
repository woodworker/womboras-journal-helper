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

        const foundHeadlines = element.querySelectorAll(headlineTags.join(", "));

        let htmlString = `<div class="wjh-toc"><h3>Table of Content</h3><hr/>`;
        let tocHtml = "";
        const idPrefix = "wjh-toc";
        let prevLevel = 0;
        foundHeadlines.forEach((headline) => {
            const level = getLevel(headline.tagName);
            const diff = level - prevLevel;

            if (diff > 0) {
                for (let indent = 0; indent < diff; indent++) {
                    tocHtml = `${tocHtml}<ul>`;
                }
            }

            if (diff < 0) {
                for (let undent = 0; undent < Math.abs(diff); undent++) {
                    tocHtml = `${tocHtml}</ul>`;
                }
            }

            if (!headline.id) {
                headline.id = idPrefix + "_" + Math.random().toString(36).substr(2, 9);
            }

            tocHtml = `${tocHtml}<li><a href="#" data-id="${headline.id}">${headline.textContent}</a></li>`;

            prevLevel = level;
        });

        for (let undent = 0; undent < prevLevel; undent++) {
            tocHtml = `${tocHtml}</ul>`;
        }

        htmlString = `${tocHtml}</div>`;

        const tocElement = htmlToElement(htmlString);
        tocElement.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            if (!ev.target) return;
            const dataId = (ev.target as HTMLElement).dataset.id;
            if (dataId && dataId.substr(0, idPrefix.length) == idPrefix) {
                const headline = document.querySelector("#" + dataId);
                headline?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
            }
        });
        return tocElement;
    });
};
