package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.repositories.IdentificationTypeRepository;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifftdial.identityservice.domains.IdentificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class IdentificationTypeServiceImpl implements IdentificationTypeService {

    private final IdentificationTypeRepository identificationTypeRepository;

    @Autowired
    public IdentificationTypeServiceImpl(IdentificationTypeRepository identificationTypeRepository) {
        this.identificationTypeRepository = identificationTypeRepository;
    }

    @Override
    public IdentificationType createIdentificationType(IdentificationType identificationType) {
        if(!identificationTypeRepository.findByTenantAndNameIgnoreCase(
                identificationType.getTenant(), identificationType.getName()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate identification type found")
                    .userMessage("Sorry. Duplicate identification type found");

        return identificationTypeRepository.save(identificationType);
    }

    @Override
    public Page<IdentificationType> fetchSortedIdentificationTypes(UUID tenant, Pageable pageable) {
        return identificationTypeRepository.findByTenant(tenant, pageable);
    }

    @Override
    public IdentificationType update(UUID tenant, UUID identificationTypePublicId, IdentificationType identificationType) {
        this.validate(tenant, identificationTypePublicId);

        if(!identificationTypeRepository.findByTenantAndNameIgnoreCaseAndIdNot(
                tenant, identificationType.getName(), identificationType.getId()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate identification type found")
                    .userMessage("Sorry. Duplicate identification type found");

        return identificationTypeRepository.save(identificationType);
    }

    @Override
    public void delete(UUID publicId) {
        identificationTypeRepository.findByPublicId(publicId).ifPresent(identificationType -> {
            identificationType.setDeleted(true);
            identificationTypeRepository.save(identificationType);
        });
    }

    @Override
    public Page<IdentificationType> fetchPersonIdentificationTypes(UUID tenant, Boolean isPerson, Pageable pageable) {
        return identificationTypeRepository.findByTenantAndPersonIs(tenant, isPerson, pageable);
    }

    @Override
    public Page<IdentificationType> fetchContactIdentificationTypes(UUID tenant, Boolean isContact, Pageable pageable) {
        return identificationTypeRepository.findByTenantAndContactIs(tenant, isContact, pageable);
    }

    @Override
    public Page<IdentificationType> searchByName(UUID tenant, String name, Pageable pageable) {
        return identificationTypeRepository.findByTenantAndNameIgnoreCase(tenant, name, pageable);
    }

    @Override
    public List<IdentificationType> fetchIdentificationTypes(UUID tenant) {
        return identificationTypeRepository.findByTenant(tenant);
    }

    @Override
    public IdentificationType validate(UUID tenant, UUID identificationTypePublicId) {
        return identificationTypeRepository.findByTenantAndPublicId(tenant, identificationTypePublicId)
                .orElseThrow(() -> new ResourceNotFoundRestApiException()
                        .userMessage("Sorry. Identification type not present.")
                        .developerMessage("Identification type not present."));
    }
}
