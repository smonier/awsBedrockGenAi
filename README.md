# aws-bedrock-gen-ai
**Experimentation with AWS Bedrock AI**
## Overview
It permits to query AWS Bedrock Generative AI Models, it has been tested with Titan Text G1 - Express v1, but can be opened to other model based on your access.
The implementation extends Jahia Content Editor to be able to automate content tagging.

An AWS account and subscription is necessary to activate the service

For example:

<img src="/doc/images/awsBedrockAutoTags.png" width="600px"/>

## How to use it

You need to configure the configuration file org.jahia.se.modules.awsBedrock.cfg as below

aws.accessKeyId=YOUR_AWS_ACCESS_KEY_ID

aws.secretAccessKey=YOUR_AWS_SECRET_ACCESS_KEY

aws.modelId=amazon.titan-text-express-v1

aws.endpoint=

aws.region=us-east-1

aws.prompt=Generate 5 tags return as an json object from the following text:

[100]: doc/images/100_overview.png
