package com.github.rahulstech.smarterp.auth.service;

import com.github.rahulstech.smarterp.auth.dto.AuthResponse;
import com.github.rahulstech.smarterp.auth.dto.LoginRequest;
import com.github.rahulstech.smarterp.auth.dto.RegisterRequest;
import com.github.rahulstech.smarterp.auth.model.UserEntity;
import com.github.rahulstech.smarterp.auth.repository.UserRepository;
import com.github.rahulstech.smarterp.auth.security.AuthenticatedUser;
import com.github.rahulstech.smarterp.common.exception.HttpException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service implementation for auth module, coordinating password hashing and JWT token generation.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate if user email already exists
        if (userRepository.existsByEmail(request.email())) {
            throw HttpException.badRequest("email is already registered");
        }

        UserEntity user = new UserEntity();
        user.setEmail(request.email());
        user.setDisplayName(request.displayName());
        user.setPassword(passwordEncoder.encode(request.password()));

        user = userRepository.save(user);

        return createAuthResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Retrieve user by email
        UserEntity user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> HttpException.unauthorized("invalid email or password"));

        // Match hashed password
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw HttpException.unauthorized("invalid email or password");
        }

        return createAuthResponse(user);
    }

    /**
     * Helper to generate symmetric JWT and construct AuthResponse.
     */
    private AuthResponse createAuthResponse(UserEntity user) {
        AuthenticatedUser principal = AuthenticatedUser.fromUserEntity(user);
        String token = jwtService.generateToken(principal);
        return new AuthResponse(
                token,
                user.getDisplayName(),
                user.getEmail()
        );
    }
}
