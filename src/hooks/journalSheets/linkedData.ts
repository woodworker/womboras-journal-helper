import { getTextNodes, replaceTextContent, htmlToElement } from "../../library/text";

/**
 * render linked entities
 *
 * templates are notes inside the journal folder `_wjhelper`
 * TODO: better template handling and includes examples
 *
 * examples:
 *  #Actor[<ActorId>]{"<templatename>"}
 *      #Actor[Fc8aZtS6j9fBJjOG]{"npc-with-race-and-bg"}
 *  #Actor[<ActorId>]{<datapath>}
 *      #Actor[Fc8aZtS6j9fBJjOG]{data.data.details.background}
 *
 * @param html
 */
export const renderLinkedData = (html: JQuery<HTMLElement>): void => {
    const textNodes = getTextNodes(html[0]);

    const documentTypes = CONST.ENTITY_LINK_TYPES; //.concat("Compendium");
    const documentRegexp = new RegExp(`#(${documentTypes.join("|")})\\[([^\\]]+)\\](?:{([^}]+)})?`, "g");

    replaceTextContent(textNodes, documentRegexp, (_, type, target, datapath): HTMLElement => {
        let document: Document | null = null;
        if (CONST.ENTITY_TYPES.includes(type)) {
            // Get the linked Entity
            const collectionName = CONFIG[type].documentClass.collectionName;
            const collection = game[collectionName];
            document = /^[a-zA-Z0-9]{16}$/.test(target) ? collection.get(target) : collection.getName(target);
            if (!document) {
                return getBrokenElement("Entity not Found");
            }
            if (!datapath) {
                return getBrokenElement('No datapath given "#<Type>[<id>]{datapath|templatename}"');
            }
        }
        if (document) {
            return resolveDocumentDisplay(document, type, datapath);
        }
        return getBrokenElement("document");
    });
};

const getBrokenElement = (msg) => {
    const a = document.createElement("a");
    a.classList.add("entity-link");
    a.draggable = true;
    a.innerHTML = `<i class="fas fa-unlink broken"></i> Broken (${msg})`;
    return a;
};
/**
 * method to dispatch the differnet render functions
 *
 * @param foundryDocument
 * @param documentType
 * @param datapath
 */
const resolveDocumentDisplay = (foundryDocument: Document, documentType, datapath: string): HTMLElement => {
    if (datapath.startsWith('"') && datapath.endsWith('"')) {
        return resolveNamedTemplate(foundryDocument, datapath);
    } else {
        return resolveDataPath(foundryDocument, documentType, datapath);
    }
};

/**
 * render a template
 *
 * @param foundryDocument
 * @param templateName
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveNamedTemplate = (foundryDocument: StoredDocument<any>, templateName: string): HTMLElement => {
    templateName = templateName.slice(1, -1);

    if (!(game instanceof Game)) {
        return getBrokenElement("Game not Found");
    }

    const templateFolder = game.folders?.find((folder) => {
        return folder.data.name == "_wjhelper" && folder.data.type == "JournalEntry";
    });

    if (!templateFolder) {
        return getBrokenElement('TemplateFolder not Found, create one called "_wjhelper"');
    }

    const templateFile = game.journal?.find((entry) => {
        return entry.data.folder == templateFolder.id && entry.data.name == templateName;
    });

    if (!templateFile) {
        return getBrokenElement("Template not Found");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateScript = Handlebars.compile((templateFile.data as any).content);
    return htmlToElement(templateScript({ documentName: foundryDocument.documentName, id: foundryDocument.id, data: foundryDocument.data })); //,
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
            return getBrokenElement("Datapath broken");
        }
    }

    const a = document.createElement("a");
    a.classList.add(...data.classes);
    a.draggable = true;
    applyDataset(a, data.dataset);
    a.innerHTML = `<i class="${data.icon}"></i> ${current}`;
    return a;
};

const applyDataset = (element, data): void => {
    for (const [k, v] of Object.entries(data as { [s: string]: string | null })) {
        if (v) {
            element.dataset[k] = v;
        }
    }
};
