import gql from 'graphql-tag';

export const AwsBedrockPromptQuery = gql`
    query AwsBedrockPrompt($path: String!, $language: String!) {
        jcr {
            nodeByPath(path:$path) {
                workspace
                uuid
                path
                displayName
                property(name:"j:awsBedrockPrompt") {
                    value
                }
                aggregatedPublicationInfo(language:$language) {
                    publicationStatus
                }
            }
        }
    }
`;
