package com.github.rahulstech.smarterp.common.interceptor;

import com.github.rahulstech.smarterp.common.provider.CurrentCompanyProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CompanyContextInterceptor implements HandlerInterceptor {

    private final CurrentCompanyProvider currentCompanyProvider;

    @Override
    @SuppressWarnings("unchecked")
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Map<String, String> pathVariables = (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        if (pathVariables != null && pathVariables.containsKey("company_id")) {
            String companyIdStr = pathVariables.get("company_id");
            try {
                currentCompanyProvider.setCompanyId(UUID.fromString(companyIdStr));
            } catch (IllegalArgumentException e) {
                // Invalid UUID, will be handled by validation or controller
            }
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        currentCompanyProvider.clear();
    }
}
