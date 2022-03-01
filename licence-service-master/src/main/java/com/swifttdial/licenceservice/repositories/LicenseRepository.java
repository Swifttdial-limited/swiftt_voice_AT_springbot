package com.swifttdial.licenceservice.repositories;

import com.swifttdial.licenceservice.domains.Licence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LicenseRepository extends JpaRepository<Licence, Long> {

    List<Licence> findByInstitutionPublicIdAndDeletedIsFalse(UUID institutionPublicId);

}
