import {registry} from '@jahia/ui-extender';
import {ContentDropdownTreeSelect} from './SelectorTypes';

export default function () {
    registry.add('callback', 'contentDropdownTree', {
        targets: ['jahiaApp-init:20'],
        callback: () => {
            registry.add('selectorType', 'DropdownTree', {
                cmp: ContentDropdownTreeSelect,
                supportMultiple: true
                // AdaptValue: (field, property) => {
                //     if (field.selectorOptions?.find(option => option.name === 'types')) {
                //         return field.multiple ? property.decryptedValues : property.decryptedValue;
                //     }
                //     return field.multiple ? property.values : property.value;
                // }
            });
            console.debug('%c Content DropdownTree Editor Extensions  is activated', 'color: #3c8cba');
        }
    });
}
