package com.github.rahulstech.smarterp.auth.security;

import com.github.rahulstech.smarterp.auth.model.UserEntity;

public record AuthenticatedUser(
        String userId,
        String email
) {

    public static AuthenticatedUser fromUserEntity(UserEntity user) {
        return new AuthenticatedUser(user.getId(), user.getEmail());
    }
}
