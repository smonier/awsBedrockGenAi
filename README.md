# aws-bedrock-gen-ai
**This selector type is experimental.**
## Overview
It allows you to display contents as a tree and pick them from
this tree. It is based on the one used to pick the categories.
But, this selector is more generic, and you can configure it to browse
the content you want.

For example, browsing the site plan tree:

<img src="/doc/images/100_overview.png" width="600px"/>

## How to use it
After importing this module in your Jahia environment the new `selectorType`
**DropdownTree** is available. To use it, create a json override file.
In this file plug the selectorType to the content property you want, then configure
the selectorType.

For example to display the site plan tree to populate the property `j:baseNode`:
```json
{
  "name": "jmix:navMenuNextBase",
  "fields": [
    {
      "name": "j:baseNode",
      "selectorType": "DropdownTree",
      "selectorOptionsMap":{
        "type": "pageTree"
      }
    }
  ]
}
```
The `selectorOptionsMap` can be configured with 3 options :
- `type` : predifined configuration, possible value is : *pageTree* and *categoryTree*. By default, without any options
the selector display the category tree. 
- `contentPath` : this option is a string which define the start point of the tree which will be displayed
- `contentTypes` : this options is a list (csv string) of content type return by the tree

For example, you can use these configurations :
```json
{
  "name": "jmix:navMenuNextBase",
  "fields": [
    {
      "name": "j:baseNode",
      "selectorType": "DropdownTree",
      "selectorOptionsMap":{
        "type": "pageTree",
        "contentPath": "$currentSite/home/mysubpage"
      }
    }
  ]
}
```
Here we use the predefined configuration for the page tree but we overwrite the starting point based on the contentPath.


```json
{
  "name": "mix:docClassification",
  "fields": [
    {
      "name": "nomenclature",
      "selectorType": "DropdownTree",
      "selectorOptionsMap": {
        "contentPath": "$currentSite/contents",
        "contentTypes": "jnt:contentFolder"
      }
    }
  ]
}
```
In the configuration above we want to display the folder tree starting from the contents folder.

[100]: doc/images/100_overview.png
