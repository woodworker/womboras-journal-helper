![](https://img.shields.io/badge/Foundry-v0.7.9-informational)
![Latest Release Download Count](https://img.shields.io/github/downloads/woodworker/womboras-journal-helper/latest/womboras-journal-helper.zip)

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
<!--- ![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fwomboras-journal-helper&colorB=4aa94a) -->

# Womboras Journal Helpers

Wombora likes to automate his Foundry Journals so he wrote some helper

## Post a Table to Chat
A small button will be added below every Table (for GMs only) to post the Table
as it is to the Chat.

This Feature may be used for Price Lists of a Merchant or in a Bar

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
in my journal entries when i want to link to an npc
```
<p><a class="entity-link" data-id="{{id}}" data-entity="{{entity}}">{{data.name}} ({{data.data.details.type}})</a></p>
```


# License
MIT License. Do what you will. PRs welcome. 
