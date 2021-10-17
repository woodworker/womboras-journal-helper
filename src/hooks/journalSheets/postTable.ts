import { getCellColumnIndices, removeTableColumns } from "../../library/tables";
import { htmlToElement } from "../../library/text";

export const renderPostTable = (html: HTMLElement | null) => {
    if (!html) return;
    if (!(game instanceof Game)) return;
    if (!game.users?.get(game.userId || "")?.isGM) return;

    html.querySelectorAll("table").forEach((element) => {
        const button = htmlToElement(`<button style="width:max-content;margin-bottom:1em;">Post Table to Chat</button>`);
        button.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            ev.cancelBubble = true;

            let clone = element.cloneNode(true) as HTMLTableElement;

            if (clone.tHead) {
                const colsToRemove = Array.from(clone.tHead.rows).reduce((cols: number[], row) => {
                    return Array.from(row.cells).reduce((cols: number[], cell) => {
                        if (cell.textContent?.trimStart().substr(0, 1) !== "#") return cols;
                        return [...cols, ...getCellColumnIndices(cell)];
                    }, cols);
                }, []);

                if (colsToRemove.length > 0) {
                    clone = removeTableColumns(clone, colsToRemove);
                }
            }

            ChatMessage.create({ content: clone.outerHTML });
        });

        if (!element.parentNode) return;

        element.parentNode.insertBefore(button, element.nextSibling);
    });
};
