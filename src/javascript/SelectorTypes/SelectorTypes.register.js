import AwsBedrockTags from './AwsBedrockTags';

export const registerSelectorTypes = registry => {
    registry.addOrReplace('selectorType', 'AwsBedrock', {cmp: AwsBedrockTags, supportMultiple: true});
};
