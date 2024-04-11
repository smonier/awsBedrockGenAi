import AwsBedrockTags from './AwsBedrockTags';

export const registerSelectorTypes = registry => {
    console.log('Register AWS Bedrock selector');
    registry.addOrReplace('selectorType', 'AwsBedrock', {cmp: AwsBedrockTags, supportMultiple: true});
};
