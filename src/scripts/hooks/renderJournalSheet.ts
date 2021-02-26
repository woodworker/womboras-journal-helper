/**
 * adds a button to post a table to the chat
 * 
 * @param html 
 */
const renderTableToChatButton = (html: JQuery<HTMLElement>) => {
    if(!game.user.isGM) return;

    html.find('table').each((_, element) => {
        const button = $(`<button style="width:max-content;margin-bottom:1em;">Post Table to Chat</button>`);
        button.on('click', (ev) => {
            ChatMessage.create({'content': element.outerHTML});
        });

        $(element).after(button);
    });
}




/**
 * function to apply all the renderJournalSheet hooks
 * 
 * @param app 
 * @param html 
 * @param data 
 */
export const renderJournalSheet = (app: JournalSheet, html: JQuery<HTMLElement>, data) => {
    console.log('Womboras Journal Renderer Executed');
    renderTableToChatButton(html);
};