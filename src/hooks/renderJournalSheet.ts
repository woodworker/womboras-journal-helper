import { getTextNodes, replaceTextContent, htmlToElement } from "../library/text";

const renderTableToChatButton = (html: JQuery<HTMLElement>) => {
    if (!game.user.isGM) return;

    html.find("table").each((_, element) => {
        const button = $(`<button style="width:max-content;margin-bottom:1em;">Post Table to Chat</button>`);
        button.on("click", (_) => {
            ChatMessage.create({ content: element.outerHTML });
        });

        $(element).after(button);
    });
};

/**
 * entity data dsiplay
 */
const renderDocumentData = (html: JQuery<HTMLElement>): void => {
    const textNodes = getTextNodes(html[0]);

    const documentTypes = CONST.ENTITY_LINK_TYPES; //.concat("Compendium");
    const documentRegexp = new RegExp(`#(${documentTypes.join("|")})\\[([^\\]]+)\\](?:{([^}]+)})?`, "g");

    replaceTextContent(
        textNodes,
        documentRegexp,
        (_, type, target, datapath): HTMLElement => {
            let entity: Entity|null = null;
            if (CONST.ENTITY_TYPES.includes(type)) {
                const config = CONFIG[type];

                // Get the linked Entity
                const collection = config.entityClass.collection;
                entity = /^[a-zA-Z0-9]{16}$/.test(target) ? collection.get(target) : collection.getName(target);
                if (!entity) {
                    return getBrokenElement('Entity not Found');
                }
            }
            return resolveDocumentDisplay(entity, type, datapath);
        }
    );
};

/**
 * method to dispatch the differnet render functions
 * 
 * @param foundryDocument 
 * @param documentType 
 * @param datapath 
 */
const resolveDocumentDisplay = (foundryDocument, documentType, datapath: string): HTMLElement => {
    if (datapath.startsWith('"') && datapath.endsWith('"')) {
        return resolveNamedTemplate(foundryDocument, datapath);
    } else {
        return resolveDataPath(foundryDocument, documentType, datapath);
    }
};

/**
 * render a singular data path
 * 
 * @param foundryDocument 
 * @param documentType 
 * @param datapath 
 */
const resolveDataPath = (foundryDocument, documentType, datapath: string): HTMLElement => {
    // Update link data
    const config = CONFIG[documentType];
    const data = {
        classes: ["entity-link"],
        icon: config.sidebarIcon,
        dataset: { entity: documentType, id: foundryDocument.id },
    };

    const paths = datapath.split(".");

    let current = foundryDocument;
    for (let i = 0; i < paths.length; ++i) {
        if (current && current[paths[i]]) {
            current = current[paths[i]];
        } else {
            return getBrokenElement('Datapath broken');
        }
    }

    const a = document.createElement("a");
    a.classList.add(...data.classes);
    a.draggable = true;
    applyDataset(a, data.dataset);
    a.innerHTML = `<i class="${data.icon}"></i> ${current}`;
    return a;
};

/**
 * render a template
 * 
 * @param foundryDocument 
 * @param templateName 
 */
const resolveNamedTemplate = (foundryDocument: Entity, templateName: string): HTMLElement => {
    templateName = templateName.slice(1, -1);

    const templateFolder = CONFIG["Folder"].entityClass.collection.find((folder) => {
        return folder.data.name == "_wjhelper" && folder.data.type == "JournalEntry";
    });

    const templateFile = CONFIG["JournalEntry"].entityClass.collection.find((entry) => {
        return entry.data.folder == templateFolder.id && entry.data.name == templateName;
    });

    if (!templateFile) {
        return getBrokenElement('Template not Found');
    }

    const templateScript = Handlebars.compile((templateFile.data as any).content);
    return htmlToElement(templateScript({...foundryDocument, id: foundryDocument.id, entity: foundryDocument.entity}));
};

const applyDataset = (element, data): void => {
    for (const [k, v] of Object.entries(data as { [s: string]: string | null })) {
        if (v) {
            element.dataset[k] = v;
        }
    }
}

const getBrokenElement = (msg) => {
    const a = document.createElement("a");
    a.classList.add('entity-link');
    a.draggable = true;
    a.innerHTML = `<i class="fas fa-unlink broken"></i> Broken (${msg})`;
    return a;
}

/**
 * function to apply all the renderJournalSheet hooks
 *
 * @param app
 * @param html
 * @param data
 */
export const renderJournalSheet = (_app: JournalSheet, html: JQuery<HTMLElement>, _data) => {
    console.log("Womboras Journal Renderer Executed");
    renderTableToChatButton(html);
    renderDocumentData(html);
};