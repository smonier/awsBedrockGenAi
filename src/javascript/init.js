import {registry} from '@jahia/ui-extender';
import register from './AwsBedrock.register';
import AwsBedrockPrompt from './AwsBedrockPrompt';

export default function () {
    registry.addOrReplace('callback', 'awsBedrockGenAi', {
        targets: ['jahiaApp-init:10'],
        callback: register
    });

    registry.add('callback', 'AwsBedrockPrompt', {
        targets: ['jahiaApp-init:99'],
        callback: () => {
            registry.add('adminRoute', 'AwsBedrockPrompt', {
                targets: ['jcontent:95'],
                label: 'Bedrock AI Prompt',
                isSelectable: true,
                requireModuleInstalledOnSite: 'aws-bedrock-gen-ai',
                render: AwsBedrockPrompt
            });

            console.log('%c AWS Bedrock Generative AI Prompt', 'color: #3c8cba');
        }
    });
}

