import { renderLinkedData } from "./journalSheets/linkedData";
import { renderPostTable } from "./journalSheets/postTable";
import { renderRollRequests } from "./journalSheets/rollRequests";
import { renderToc } from "./journalSheets/toc";

/**
 * function to apply all the renderJournalSheet hooks
 *
 * @param app
 * @param html
 * @param data
 */
export const renderJournalSheet = (app: JournalSheet, html: JQuery<HTMLElement>, _data) => {
    console.log("Womboras Journal Renderer Executed");

    renderToc(app.form);
    renderPostTable(app.form);
    renderRollRequests(html);
    renderLinkedData(html);
};
