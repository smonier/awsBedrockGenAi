export const adaptToTree = ({nodes, parent, selectedValues, locale}) => {
    // LocaleCompare in JS expect a locale like en-US NOT en_US which Jahia uses.
    if (locale && locale.indexOf('_') !== -1) {
        locale = locale.replace('_', '-');
    }

    return nodes
        .filter(node => node.parent.uuid === parent.uuid)
        .map(node => {
            return {
                id: node.value,
                value: node.value,
                label: node.label,
                expanded: nodes.filter(item => item.parent.uuid === node.uuid).filter(item => selectedValues && selectedValues.includes(item.uuid)).length > 0,
                checked: selectedValues ? selectedValues.includes(node.uuid) : undefined,
                children: adaptToTree({
                    nodes,
                    locale,
                    parent: node,
                    selectedValues
                }).sort((c1, c2) => c1.label.localeCompare(c2.label, locale))
            };
        });
};
