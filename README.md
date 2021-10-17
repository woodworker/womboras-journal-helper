![](https://img.shields.io/badge/Foundry-v0.8.9-informational)
<!--- Downloads @ Latest Badge -->
<!--- replace <user>/<repo> with your username/repository -->
<!--- ![Latest Release Download Count](https://img.shields.io/github/downloads/woodworker/womboras-journal-helper/latest/module.zip) -->

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
<!--- ![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fwomboras-journal-helper&colorB=4aa94a) -->

# Womboras Journal Helpers

Wombora likes to automate his Foundry Journals so he wrote some helper

## Post a Table to Chat
A small button will be added below every Table (for GMs only) to post the Table
as it is to the Chat.

This Feature may be used for Price Lists of a Merchant or in a Bar

There is also an option to filter out columns if a coresponding header cell
text starts with a #

## "Enhanced" Journal Links

There are also some Journal link improvements added.
For these features to function propperly the GM actually need to know the Datastructure of
the linked entity

### Simple data path access
If you dont want to display a name of an entity for a journal link this is the feature to go

for example `#Actor[ItemId]{data.data.details.type}` will show the type field from a DND5E Actor (NPC)

### Templated Journal Links

This feature could almost used as an Inline view of any given entity

For this to work there must be a journal folder created called `_wjhelper`.
In this folder there can be journal entries created and handlebar variable syntax be used.

For example i created myself a temapltes called `npc` with the following content to have a more detailed link
in my journal entries when i want to link to an dnd5e npc

```
<p><a class="entity-link" data-id="{{id}}" data-entity="{{entity}}">{{data.name}} ({{data.data.details.type}})</a></p>
```
## Table of Contents

If you tend to write longer texts in to your Journals with a lot of headlines and sub headlines
you can now add `[toc]` in your journal.

The entries are clickable and will scroll the headline into view


## Roll Requests

When using the dnd5e system you can just write a roll into your journal and there will be clickable
buttons when rendered. They will post a chat message so players do not need to search the specific button in thier
charachter sheet and can just click to roll.

Ability saves, skills checks and saves

Examples:
- `dex save`
- `dexterity saving throw`
- `sleight of hand check`
- `sleight of hand ability Check`

# License
MIT License. Do what you will. PRs welcome. 
