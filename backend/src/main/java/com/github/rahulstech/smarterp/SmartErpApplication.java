package com.github.rahulstech.smarterp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.UserDetailsAwareConfigurer;

@SpringBootApplication(
        exclude = {
                UserDetailsServiceAutoConfiguration.class
        }
)
public class SmartErpApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartErpApplication.class, args);
	}

}
