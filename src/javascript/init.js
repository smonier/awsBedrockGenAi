import {registry} from '@jahia/ui-extender';
import register from './AwsBedrock.register';

export default function () {
    registry.addOrReplace('callback', 'awsBedrockGenAi', {
        targets: ['jahiaApp-init:10'],
        callback: register
    });
}

