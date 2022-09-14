# dropdown-tree-select
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
      "selectorOptions":[
        {
          "name": "path",
          "value" : "$currentSite"
        },
        {
          "name": "types",
          "value" : "jnt:page,jnt:navMenuText"
        }
      ]
    }
  ]
}
```
In the `selectorOptions` you provide where do you want to start the content search
and which type of content you want to return.

[100]: doc/images/100_overview.png
