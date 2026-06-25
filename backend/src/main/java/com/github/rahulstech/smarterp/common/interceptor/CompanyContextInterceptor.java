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

/**
 * Intercepts requests to extract the 'company_id' path variable from the request URI.
 * Registers the extracted ID in a thread-local provider to scope operations to that company.
 */
@Component
@RequiredArgsConstructor
public class CompanyContextInterceptor implements HandlerInterceptor {

    private final CurrentCompanyProvider currentCompanyProvider;

    /**
     * Extracts 'company_id' path variable from request URI variables and binds it 
     * to the thread-local company provider context prior to controller execution.
     */
    @Override
    @SuppressWarnings("unchecked")
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Map<String, String> pathVariables = (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        if (pathVariables != null && pathVariables.containsKey("company_id")) {
            String companyIdStr = pathVariables.get("company_id");
            try {
                currentCompanyProvider.setCompanyId(UUID.fromString(companyIdStr));
            } catch (IllegalArgumentException e) {
                // Invalid UUID is ignored here; it will be rejected by validation or the handler later.
            }
        }
        return true;
    }

    /**
     * Clears the thread-local company context once the request completes,
     * preventing context pollution and potential thread-reuse memory leaks.
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        currentCompanyProvider.clear();
    }
}
