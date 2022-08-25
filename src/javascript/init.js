import {registry} from '@jahia/ui-extender';
import {ContentDropdownTreeSelect} from './SelectorTypes';

export default function () {
    registry.add('callback', 'codeMirrorEditor', {
        targets: ['jahiaApp-init:20'],
        callback: () => {
            registry.add('selectorType', 'DropdownTree', {cmp: ContentDropdownTreeSelect, supportMultiple: true});
            console.debug('%c DropdownTree Editor Extensions  is activated', 'color: #3c8cba');
        }
    });
}
