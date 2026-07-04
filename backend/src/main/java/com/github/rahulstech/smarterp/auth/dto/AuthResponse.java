package com.github.rahulstech.smarterp.auth.dto;

/**
 * DTO representing successful authentication response.
 */
public record AuthResponse(
        String authToken,
        String userDisplayName,
        String userEmail
) {}
