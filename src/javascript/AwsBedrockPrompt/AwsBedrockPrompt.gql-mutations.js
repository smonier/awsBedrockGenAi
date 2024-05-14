import gql from 'graphql-tag';

export const AwsBedrockPromptMutation = gql`
    mutation AwsBedrockPrompt($path: String!, $value: String!, $publish: Boolean!) {
      jcr {
        mutateNode(pathOrId:$path) {
          addMixins(mixins:["jmix:awsBedrock"])
          mutateProperty(name:"j:awsBedrockPrompt") {
            setValue(value:$value)
          }
          publish @include(if: $publish)
        }
      }
    }
`;
