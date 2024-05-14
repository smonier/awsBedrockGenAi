package org.jahia.se.modules.awsbedrock.service;

import java.util.List;

public interface RequestAwsBedrockService {

    public List<String> generateAutoTags(String path, String language, String prompt) throws Exception;

}
