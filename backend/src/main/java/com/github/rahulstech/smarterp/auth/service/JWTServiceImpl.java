package com.github.rahulstech.smarterp.auth.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.github.rahulstech.smarterp.auth.security.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JWTServiceImpl implements JWTService {

    private static final long AUTH_TOKEN_EXPIRE_AFTER_MILLIS = 24 * 60 * 60 * 1000; // one day

    private final String jwtSecret;

    public JWTServiceImpl(@Value("${smarterp.auth.jwt.secret}") String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    @Override
    public String generateToken(AuthenticatedUser principal) {
        long expirationMs = System.currentTimeMillis() + AUTH_TOKEN_EXPIRE_AFTER_MILLIS;
        Date expiresAt = new Date(expirationMs);

        // Symmetric signing using HMAC256
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
        String token = JWT.create()
                .withSubject(principal.userId())
                .withClaim("email", principal.email())
                .withExpiresAt(expiresAt)
                .sign(algorithm);

        return token;
    }

    @Override
    public AuthenticatedUser verifyToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decodedJWT = verifier.verify(token);
        String userId = decodedJWT.getSubject();
        String email = decodedJWT.getClaim("email").asString();
        return new AuthenticatedUser(userId, email);
    }
}
