package org.jahia.se.modules.awsbedrock.actions;

import org.jahia.bin.Action;
import org.jahia.bin.ActionResult;
import org.jahia.se.modules.awsbedrock.service.RequestAwsBedrockService;
import org.jahia.se.modules.awsbedrock.service.impl.RequestAwsBedrockServiceImpl;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.render.RenderContext;
import org.jahia.services.render.Resource;
import org.jahia.services.render.URLResolver;
import org.json.JSONArray;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@Component(service = Action.class, immediate = true)
public class RequestAwsBedrockAction extends Action {
    private static final Logger LOGGER = LoggerFactory.getLogger(RequestAwsBedrockAction.class);

    @Activate
    public void activate() {
        setName("requestAwsBedrock");
        setRequireAuthenticatedUser(true);
        setRequiredPermission("jcr:write_default");
        setRequiredWorkspace("default");
        setRequiredMethods("GET,POST");
    }

    private RequestAwsBedrockService awsBedrockGeneratorService;

    @Reference(service = RequestAwsBedrockService.class)
    public void setRequestAwsBedrockService(
            RequestAwsBedrockService awsBedrockGeneratorService) {
        this.awsBedrockGeneratorService = awsBedrockGeneratorService;
    }

    public RequestAwsBedrockService getRequestAwsBedrockService() {

        return awsBedrockGeneratorService;
    }
    
    @Override
    public ActionResult doExecute(HttpServletRequest httpServletRequest, RenderContext renderContext, Resource resource,
           JCRSessionWrapper jcrSessionWrapper, Map<String, List<String>> map, URLResolver urlResolver)
           throws Exception {

        final JSONObject resp = new JSONObject();
        JSONObject data;
        int resultCode =  HttpServletResponse.SC_BAD_REQUEST;
        final String currentLanguage = resource.getLocale().getLanguage();
        LOGGER.info("path: "+resource.getNode().getPath());
        data = awsBedrockGeneratorService.generateAutoTags(resource.getNode().getPath(), currentLanguage);
        JSONArray jsonArray = new JSONArray(data);
        resp.put("outputText", jsonArray);
        resultCode = HttpServletResponse.SC_OK;

        return new ActionResult(resultCode, null, resp);    }
}
