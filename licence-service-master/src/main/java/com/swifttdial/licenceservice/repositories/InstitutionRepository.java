package com.swifttdial.licenceservice.repositories;

import com.swifttdial.licenceservice.domains.Institution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    List<Institution> findByInstitutionNameIgnoreCase(String institutionName);

    Page<Institution> findByInstitutionNameIgnoreCase(String institutionName, Pageable pageable);

    List<Institution> findByRegistrationNumberIgnoreCase(String registrationNumber);

    Optional<Institution> findByPublicIdAndDeletedIsFalse(UUID institutionPublicId);

    Page<Institution> findByDeletedIsFalse(Pageable pageable);

    List<Institution> findByRegistrationNumberIgnoreCaseAndIdNot(String registrationNumber, Long institutionId);
}
