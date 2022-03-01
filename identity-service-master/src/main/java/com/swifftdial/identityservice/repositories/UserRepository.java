package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created by daniel.gathigai on 14/09/2016.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByUsernameIgnoreCase(String username);

    Page<User> findByTenantAndUsernameContainingIgnoreCaseAndDeletedIsFalse(
            UUID tenant, String username, Pageable pageable);

    List<User> findByEmailAddressIgnoreCase(String emailAddress);

    Optional<User> findByTenantAndPublicId(UUID tenant, UUID userPublicId);

    Page<User> findByTenantAndUsernameNotNullAndPasswordNotNull(UUID tenant, Pageable pageable);

    Page<User> findByTenantAndEnabledAndUsernameNotNullAndPasswordNotNull(UUID tenant, Boolean enabled, Pageable pageable);

    Page<User> findByRoles_PublicId(UUID rolePublicId, Pageable pageable);

    Page<User> findByTenantAndUsernameContainingIgnoreCaseAndEnabledIsAndDeletedIsFalse(
            UUID tenant, String username, Boolean enabled, Pageable pageable);

    List<User> findByEmailAddressIgnoreCaseAndPublicIdNot(String emailAddress, UUID publicId);

    Page<User> findByRoles_PublicIdAndEnabledIs(UUID rolePublicId, Boolean enabled, Pageable pageable);

    Page<User> findByTenantAndRoles_DepartmentPublicIdAndEnabledIs(
            UUID tenant, UUID departmentPublicId, Boolean enabled, Pageable pageable);

    Optional<User> findByPublicId(UUID userPublicId);

}