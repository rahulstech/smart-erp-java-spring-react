package com.github.rahulstech.smarterp.common.provider;

import org.springframework.stereotype.Component;
import java.util.UUID;

/**
 * Thread-local container holding the current request's active Company ID context.
 * Enables service classes to retrieve context implicitly without method parameter pollution.
 */
@Component
public class CurrentCompanyProvider {

    private static final ThreadLocal<UUID> currentCompanyId = new ThreadLocal<>();

    /**
     * Retrieves the company ID registered to the current execution thread.
     */
    public UUID getCompanyId() {
        return currentCompanyId.get();
    }

    /**
     * Binds a company ID to the current execution thread.
     */
    public void setCompanyId(UUID companyId) {
        currentCompanyId.set(companyId);
    }

    /**
     * Clears the company ID bound to the current execution thread.
     */
    public void clear() {
        currentCompanyId.remove();
    }
}
