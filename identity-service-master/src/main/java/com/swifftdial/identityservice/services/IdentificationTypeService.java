package com.swifftdial.identityservice.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

import com.swifftdial.identityservice.domains.IdentificationType;

public interface IdentificationTypeService {

    IdentificationType createIdentificationType(IdentificationType identificationType);

    Page<IdentificationType> fetchSortedIdentificationTypes(UUID tenant, Pageable pageable);

    IdentificationType update(UUID tenant, UUID identificationTypePublicId, IdentificationType identificationType);

    void delete(UUID publicId);

    Page<IdentificationType> fetchPersonIdentificationTypes(UUID tenant, Boolean isPerson, Pageable pageable);

    Page<IdentificationType> fetchContactIdentificationTypes(UUID tenant, Boolean isContact, Pageable pageable);

    Page<IdentificationType> searchByName(UUID tenant, String name, Pageable pageable);

    List<IdentificationType> fetchIdentificationTypes(UUID tenant);

    IdentificationType validate(UUID tenant, UUID identificationTypePublicId);

}
