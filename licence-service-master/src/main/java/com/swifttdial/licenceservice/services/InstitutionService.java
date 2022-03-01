package com.swifttdial.licenceservice.services;

import com.swifttdial.licenceservice.domains.dto.InstitutionDTO;
import com.swifttdial.licenceservice.domains.dto.SystemUser;
import com.swifttdial.licenceservice.domains.Institution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface InstitutionService {

    Institution createInstitution(InstitutionDTO institution);

    Institution createInstitution(Institution institution);

    Institution validate(UUID institutionPublicId);

    Optional<Institution> fetchByPublicId(UUID institutionPublicId);

    Page<Institution> fetchInstitutions(String searchQueryParam, Pageable pageable);

    Page<Institution> fetchInstitutions(Pageable pageable);

    Institution update(UUID institutionPublicId, Institution institution, SystemUser by);
}
