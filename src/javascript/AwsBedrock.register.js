import {registry} from '@jahia/ui-extender';
import {registerSelectorTypes} from './SelectorTypes/SelectorTypes.register';

export default () => {
    registerSelectorTypes(registry);
    console.log('%c AWS Bedrock selectorType (tags) has been registered', 'color: #3c8cba');
};
