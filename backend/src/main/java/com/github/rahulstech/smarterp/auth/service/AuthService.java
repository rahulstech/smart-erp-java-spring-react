package com.github.rahulstech.smarterp.auth.service;

import com.github.rahulstech.smarterp.auth.dto.AuthResponse;
import com.github.rahulstech.smarterp.auth.dto.LoginRequest;
import com.github.rahulstech.smarterp.auth.dto.RegisterRequest;

/**
 * Service interface for user authentication and registration operations.
 */
public interface AuthService {

    /**
     * Authenticates a user with the provided credentials.
     *
     * @param request login request details
     * @return the authentication response containing token and user details
     */
    AuthResponse login(LoginRequest request);

    /**
     * Registers a new user in the system.
     *
     * @param request registration request details
     * @return the authentication response containing token and user details
     */
    AuthResponse register(RegisterRequest request);
}
