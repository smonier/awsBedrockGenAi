import {registry} from '@jahia/ui-extender';
import {registerSelectorTypes} from './SelectorTypes/SelectorTypes.register';

export default () => {
    registerSelectorTypes(registry);
    console.debug('%c AWS Bedrock is activated', 'color: #3c8cba');
};
