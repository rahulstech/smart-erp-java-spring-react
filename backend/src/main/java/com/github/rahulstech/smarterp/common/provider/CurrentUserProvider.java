package com.github.rahulstech.smarterp.common.provider;

import org.springframework.stereotype.Component;

@Component
public class CurrentUserProvider {

    public String getCurrentUserId() {
        return "DEV_USER";
    }
}
