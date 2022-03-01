package com.swifttdial.atservice.repositories;

import com.swifttdial.atservice.domains.CallProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CallProfileRepository extends JpaRepository<CallProfile, Long> {

    Optional<CallProfile> findByPublicId(UUID publicId);

    Optional<CallProfile> findByTenant(UUID publicId);
}
