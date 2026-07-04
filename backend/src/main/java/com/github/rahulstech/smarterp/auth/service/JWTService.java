package com.github.rahulstech.smarterp.auth.service;

import com.github.rahulstech.smarterp.auth.security.AuthenticatedUser;

public interface JWTService {

    String generateToken(AuthenticatedUser principal);

    AuthenticatedUser verifyToken(String token);
}
