package org.jahia.se.modules.awsbedrock.service.impl;


import org.jahia.api.Constants;
import org.jahia.se.modules.awsbedrock.service.RequestAwsBedrockService;
import org.jahia.se.modules.awsbedrock.util.BedrockRequestBody;
import org.jahia.services.content.JCRPropertyWrapperImpl;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.content.JCRTemplate;
import org.jahia.services.content.LazyPropertyIterator;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.utils.LanguageCodeConverters;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.osgi.service.cm.ConfigurationException;
import org.osgi.service.cm.ManagedService;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.auth.credentials.SystemPropertyCredentialsProvider;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;
import java.nio.charset.Charset;

import javax.jcr.RepositoryException;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;


@Component(service = {RequestAwsBedrockService.class, ManagedService.class}, property = "service.pid=org.jahia.se.modules.awsBedrock", immediate = true)
public class RequestAwsBedrockServiceImpl implements RequestAwsBedrockService, ManagedService {

    private static final Logger LOGGER = LoggerFactory.getLogger(RequestAwsBedrockServiceImpl.class);
    public static String accessKey;
    public static String secretKey;
    public static String bedrockModelId;
    public static String endpoint;
    public static String regionProps;
    public static String maxTagsAdded;
    public static String inputText;
    public static String promptProps;
    public static String maxStringLengthProps;

    @Override
    public List<String> generateAutoTags(String path, String language, String prompt) throws Exception {

        String cleanText = getTextFromNode(path, language);
//        String PROMPT = promptProps + cleanText;
        String PROMPT = prompt;
        LOGGER.info("PROMPT : " + PROMPT);
        LOGGER.info("Region : " + regionProps);
        LOGGER.info("ModelId : " + bedrockModelId);
        //LOGGER.info(System.getProperty("aws.accessKeyId")+" / "+System.getProperty("aws.secretAccessKey"));

        return invokeAwsBedrock(limitStringLength(PROMPT,Integer.parseInt(maxStringLengthProps)), regionProps, bedrockModelId);
    }

    /**
     * Invokes the Titan Text G1 - Express model to run an inference using the input provided.
     *
     * @param prompt The prompt for Titan Text Express to complete.
     * @return The inference response from the model.
     * @throws Exception If there is an error during the invocation.
     */
    public static List<String> invokeAwsBedrock(String prompt, String region, String modelId) throws Exception {
        List<String> bedrockResponse = null;
        try (
            BedrockRuntimeClient bedrockClient = BedrockRuntimeClient.builder()
                    .region(Region.of(region))
                    .credentialsProvider(SystemPropertyCredentialsProvider.create())
                    .build()) {

            String bedrockBody = BedrockRequestBody.builder()
                    .withModelId(modelId)
                    .withPrompt(prompt)
                    .build();

            InvokeModelRequest invokeModelRequest = InvokeModelRequest.builder()
                    .modelId(modelId)
                    .body(SdkBytes.fromString(bedrockBody, Charset.defaultCharset()))
                    .build();

            InvokeModelResponse invokeModelResponse = bedrockClient.invokeModel(invokeModelRequest);
            JSONObject responseAsJson = new JSONObject(invokeModelResponse.body().asUtf8String());

            switch (modelId) {
                case "amazon.titan-tg1-large":
                case "amazon.titan-text-express-v1":
                    // Assuming the response body has a "results" field that is an array of objects
                    // This part might need adjustments based on the actual response structure
                    LOGGER.info("Response: " + responseAsJson.getJSONArray("results").getJSONObject(0).toString());
                    bedrockResponse =  extractTagsFromTitan(responseAsJson.getJSONArray("results").getJSONObject(0).toString());
                break;
                case "anthropic.claude-instant-v1":
                case "anthropic.claude-v1":
                case "anthropic.claude-v2":
                    LOGGER.info("Response: " + responseAsJson.getString("completion"));
                    bedrockResponse =  extractTagsFromClaude(responseAsJson.getString("completion"));

            }
            return bedrockResponse;
        }
    }

    public static String limitStringLength(String input, int maxLength) {
        if (input == null) return null; // handle null input gracefully

        int actualLength = input.length();
        if (actualLength > maxLength) {
            // Optionally log or handle the case where input exceeds maxLength
            System.out.println("Malformed input request: expected maxLength: " + maxLength + ", actual: " + actualLength);
            return input.substring(0, maxLength);
        }

        return input; // Return the original string if it's within the limit
    }

    public static List<String> extractTagsFromTitan(String jsonString) throws JSONException {
        JSONObject jsonObject = new JSONObject(jsonString);
        String outputText = jsonObject.getString("outputText");

        // Split the output text into lines and process each line
        String[] lines = outputText.split("\\n");
        List<String> tags = new ArrayList<>();

        // Iterate over each line, extracting the tag if it matches the expected format
        for (String line : lines) {
            if (line.matches("^\\d+\\.\\s+.*$")) {
                // Remove the numbering and add to the list
                tags.add(line.replaceAll("^\\d+\\.\\s+", ""));
            }
        }

        return tags;
    }
    public static List<String> extractTagsFromClaude(String jsonString) throws JSONException {
        /*JSONObject jsonObject = new JSONObject(jsonString);
        String outputText = jsonObject.getString("text");*/

        // Split the output text into lines and process each line
        String[] lines = jsonString.split("\\n");
        List<String> tags = new ArrayList<>();

        // Iterate over each line, extracting the tag if it matches the expected format
        for (String line : lines) {
            if (line.matches("^\\d+\\.\\s+.*$")) {
                // Remove the numbering and add to the list
                tags.add(line.replaceAll("^\\d+\\.\\s+", ""));
            }
        }

        return tags;
    }
    public static String getTextFromNode(String path, String language) {

        try {
            final Locale srcLocale = LanguageCodeConverters.getLocaleFromCode(language);
            final Map<String, String> contentToAnalyse = JCRTemplate.getInstance().doExecuteWithSystemSessionAsUser(null, Constants.EDIT_WORKSPACE, srcLocale, (JCRSessionWrapper session) -> {
                final Map<String, String> srcValues = new HashMap<>();
                final LazyPropertyIterator propertyIterator = (LazyPropertyIterator) session.getNode(path).getProperties();
                while (propertyIterator.hasNext()) {
                    final JCRPropertyWrapperImpl property = (JCRPropertyWrapperImpl) propertyIterator.nextProperty();
                    final ExtendedPropertyDefinition definition = property.getDefinition();
                    if (definition.isInternationalized() && !definition.isMultiple()) {
                        srcValues.put(property.getName(), property.getValue().getString());
                    }
                }
                return srcValues;
            });

            for (Map.Entry<String, String> entry : contentToAnalyse.entrySet()) {
                inputText += entry.getValue();
            }

            return removeHtmlTags(inputText);

        } catch (RepositoryException ex) {
            LOGGER.error(String.format("Impossible to extract text from node: %s in %s", path, language), ex);
            return null;
        }

    }

    private static String removeHtmlTags(String inputText) {
        Document doc = Jsoup.parse(inputText);
        return doc.text();
    }

    @Override
    public void updated(Dictionary<String, ?> dictionary) throws ConfigurationException {
        if (dictionary != null) {
            accessKey = (String) dictionary.get("aws.accessKeyId");
            System.setProperty("aws.accessKeyId", accessKey);
            secretKey = (String) dictionary.get("aws.secretAccessKey");
            System.setProperty("aws.secretAccessKey", secretKey);
            bedrockModelId = (String) dictionary.get("aws.modelId");
            endpoint = (String) dictionary.get("aws.endpoint");
            regionProps = (String) dictionary.get("aws.region");
            System.setProperty("aws.region", regionProps);
            maxTagsAdded = (String) dictionary.get("aws.maxTagsAdded");
            promptProps = (String) dictionary.get("aws.prompt");
            maxStringLengthProps = (String) dictionary.get("aws.maxStringLength");

        }
        if (!(accessKey != null && !accessKey.trim().isEmpty()))
            LOGGER.error("awsBedrock accessKey not defined. Please add it to org.jahia.se.modules.awsBedrock.cfg");
        LOGGER.debug("awsBedrock.accessKey = {}", accessKey);
    }
}
