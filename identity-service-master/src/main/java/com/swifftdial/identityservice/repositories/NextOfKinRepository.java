package com.swifftdial.identityservice.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

import com.swifftdial.identityservice.domains.NextOfKin;

@Repository
public interface NextOfKinRepository extends JpaRepository<NextOfKin, Long> {
    Optional<NextOfKin> findByPublicId(UUID publicId);
    Page<NextOfKin> findByUserPublicId(UUID userPublicId, Pageable pageable);
}
