export const getTextNodes = (parent) => {
    const iterator = document.createNodeIterator(parent, NodeFilter.SHOW_TEXT);
    const textNodes: Node[] = [];
    let currentTextNode;
    while ((currentTextNode = iterator.nextNode())) {
        if (currentTextNode instanceof Node) {
            textNodes.push(currentTextNode);
        }
    }
    return textNodes;
};

export const replaceTextContent = (text, rgx, func) => {
    let replaced = false;
    for (const t of text) {
        const matches = t.textContent.matchAll(rgx);
        for (const match of Array.from(matches).reverse()) {
            // eslint-disable-next-line
            const replacement = func(...match as any);
            if (replacement) {
                replaceTextNode(t, match, replacement);
                replaced = true;
            }
        }
    }
    return replaced;
};

const replaceTextNode = (text, match, replacement) => {
    let target = text;
    if (match.index > 0) {
        target = text.splitText(match.index);
    }
    if (match[0].length < target.length) {
        target.splitText(match[0].length);
    }
    target.replaceWith(replacement);
};

export const htmlToElement = (html: string): HTMLElement => {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
}
