package com.github.rahulstech.smarterp.auth.repository;

import com.github.rahulstech.smarterp.auth.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for database operations on UserEntity.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    /**
     * Finds a user by their email address.
     *
     * @param email the email address to look up
     * @return an Optional containing the UserEntity if found
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Checks if a user already exists with the given email.
     *
     * @param email the email to check
     * @return true if a user exists, false otherwise
     */
    boolean existsByEmail(String email);
}
