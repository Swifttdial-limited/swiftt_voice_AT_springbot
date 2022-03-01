package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.BaseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@NoRepositoryBean
public interface GenericJpaRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {

    <U> Optional<T> findById(U id);

    Optional<T> findByPublicId(UUID publicId);

    <T extends BaseEntity> Page<T> findByTenant(UUID tenant, Pageable pageable);

    List<T> findByTenant(UUID tenant);

    Optional<T> findByTenantAndPublicId(UUID tenant, UUID publicId);
}