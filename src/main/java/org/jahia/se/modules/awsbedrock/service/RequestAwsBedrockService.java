package org.jahia.se.modules.awsbedrock.service;

import org.json.JSONObject;

public interface RequestAwsBedrockService {

    public JSONObject generateAutoTags(String path, String language) throws Exception;

}
