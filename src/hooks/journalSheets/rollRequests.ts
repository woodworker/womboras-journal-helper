import { getTextNodes, replaceTextContent } from "../../library/text";

type KeyedArray = { [key: string]: string[] };

/**
 * render roll request links inside a journal page
 *
 * only supports dnd5e right now
 *
 * example:
 *  just add "Perception Check" in your journal
 *
 * @param html
 */
export const renderRollRequests = (html: JQuery<HTMLElement>): void => {
    if ((game as Game).system.id !== "dnd5e") {
        return;
    }

    const skills = {
        acr: ["ARC", "Acrobatics"],
        ani: ["ANI", "AnimalHandling", "Animal Handling"],
        arc: ["ARC", "Arcana"],
        ath: ["ATH", "Athletics"],
        dec: ["DEC", "Deception"],
        his: ["HIS", "History"],
        ins: ["INS", "Insight"],
        itm: ["ITM", "Intimidation"],
        inv: ["INV", "Investigation"],
        med: ["MED", "Medicine"],
        nat: ["NAT", "Nature"],
        prc: ["PRC", "Perception"],
        prf: ["PRF", "Performance"],
        per: ["PER", "Persuasion"],
        rel: ["REL", "Religion"],
        slt: ["SLT", "SleightOfHand", "Sleight of Hand"],
        ste: ["STE", "Stealth"],
        sur: ["SUR", "Survival"],
    };

    const abilities = {
        str: ["STR", "Strength"],
        dex: ["DEX", "Dexterity"],
        con: ["CON", "Constitution"],
        int: ["INT", "Intelligence"],
        wis: ["WIS", "Wisdom"],
        cha: ["CHA", "Charisma"],
    };

    const rollTypes = {
        save: ["Save", "Savingthrow", "Saving Throw"],
        check: ["Check", "Ability Check"],
    };

    const rollRequestRegexp = new RegExp(`(${concater({ ...skills, ...abilities }, "|")}) (${concater(rollTypes, "|")})`, "gi");

    const textNodes = getTextNodes(html[0]);
    replaceTextContent(textNodes, rollRequestRegexp, (fullMatch, skillOrAbility: string, rollType: string): HTMLElement => {
        rollType = rollType.toUpperCase();

        const isSkill = isInKeyedArray(skillOrAbility, skills);
        const isAbility = isInKeyedArray(skillOrAbility, abilities);

        const isRollType = isInKeyedArray(rollType, rollTypes);
        const rollTypeKey = getKey(rollType, rollTypes);

        // does not exist
        if ((!isSkill && !isAbility) || !isRollType || (isSkill && rollTypeKey === "save")) {
            const span = document.createElement("span");
            span.textContent = `${fullMatch}`;
            return span;
        }

        const requestLink = document.createElement("a");
        requestLink.href = "#";
        requestLink.title = `Request a ${fullMatch} in Chat`;
        requestLink.textContent = `${fullMatch}`;
        requestLink.classList.add("entity-link");
        requestLink.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            ev.cancelBubble = true;
            const key = getKey(skillOrAbility, { ...skills, ...abilities });
            if (isSkill) {
                ChatMessage.create({ content: `<h3>Roll request<h3><hr/>[[/roll 1d20+@skills.${key}.total]]{${fullMatch}}` });
                return;
            }
            if (rollTypeKey === "save") {
                ChatMessage.create({ content: `<h3>Roll request<h3><hr/>[[/roll 1d20+@abilities.${key}.save]]{${fullMatch}}` });
                return;
            }

            ChatMessage.create({ content: `<h3>Roll request<h3><hr/>[[/roll 1d20+@abilities.${key}.mod]]{${fullMatch}}` });
            return;
        });

        return requestLink;
    });
};

/**
 * concats all the values of a KeyedArray
 */
const concater = (items: KeyedArray, joinString: string): string => {
    return Object.values(items).reduce((prev: string, cur: string[]) => {
        if (!prev) {
            return cur.join(joinString);
        }
        return `${prev}|${cur.join(joinString)}`;
    }, "");
};

/**
 * checks if a value is in a KeyedArray
 */
const isInKeyedArray = (item: string, list: KeyedArray): boolean => {
    return Object.values(list).reduce((prev: boolean, cur: string[]) => {
        if (cur.map((s) => s.toLocaleLowerCase()).includes(item.toLocaleLowerCase())) {
            return true;
        }
        return prev;
    }, false);
};

/**
 * returns the key if found in any of the values of a KeyedArray
 */
const getKey = (item: string, list: KeyedArray): string | false => {
    const result = Object.entries(list).filter(([_, listItemValues]) => {
        return listItemValues.map((s) => s.toLocaleLowerCase()).includes(item.toLocaleLowerCase());
    });

    if (result.length === 1 && result[0].length === 2) {
        return result[0][0];
    }

    return false;
};
