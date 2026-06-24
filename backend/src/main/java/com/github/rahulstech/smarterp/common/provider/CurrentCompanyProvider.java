package com.github.rahulstech.smarterp.common.provider;

import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class CurrentCompanyProvider {

    private static final ThreadLocal<UUID> currentCompanyId = new ThreadLocal<>();

    public UUID getCompanyId() {
        return currentCompanyId.get();
    }

    public void setCompanyId(UUID companyId) {
        currentCompanyId.set(companyId);
    }

    public void clear() {
        currentCompanyId.remove();
    }
}
