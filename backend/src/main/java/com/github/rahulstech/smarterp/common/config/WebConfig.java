package com.github.rahulstech.smarterp.common.config;

import com.github.rahulstech.smarterp.common.interceptor.CompanyContextInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final CompanyContextInterceptor companyContextInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(companyContextInterceptor)
                .addPathPatterns("/api/companies/**");
    }
}
