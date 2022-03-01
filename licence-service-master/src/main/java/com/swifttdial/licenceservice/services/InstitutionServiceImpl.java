package com.swifttdial.licenceservice.services;

import com.swifttdial.licenceservice.domains.Institution;
import com.swifttdial.licenceservice.domains.dto.InstitutionDTO;
import com.swifttdial.licenceservice.domains.dto.SystemUser;
import com.swifttdial.licenceservice.repositories.InstitutionRepository;
import com.swifttdial.licenceservice.utils.exceptions.BadRequestRestApiException;
import com.swifttdial.licenceservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifttdial.licenceservice.utils.messaging.StreamChannels;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class InstitutionServiceImpl implements InstitutionService {

    private final InstitutionRepository institutionRepository;
    private final MessageChannel institutionCreatedChannel;
    private final MessageChannel clientInstitutionCreatedChannel;

    @Autowired
    public InstitutionServiceImpl(InstitutionRepository institutionRepository, StreamChannels streamChannels) {
        this.institutionRepository = institutionRepository;
        this.institutionCreatedChannel = streamChannels.institutionCreated();
        clientInstitutionCreatedChannel = streamChannels.clientInstitutionCreated();
    }

    @Override
    public Institution createInstitution(InstitutionDTO institutionDTO) {
        if (!institutionRepository.findByInstitutionNameIgnoreCase(institutionDTO.getInstitution().getInstitutionName()).isEmpty())
            throw new BadRequestRestApiException()
                    .userMessage("Sorry. Duplicate institution exists.")
                    .developerMessage("Duplicate institution exists.");

        if(institutionDTO.getInstitution().getRegistrationNumber() != null)
            if (!institutionRepository.findByRegistrationNumberIgnoreCase(institutionDTO.getInstitution().getRegistrationNumber()).isEmpty())
                throw new BadRequestRestApiException()
                        .userMessage("Sorry. Duplicate institution exists.")
                        .developerMessage("Duplicate institution exists.");

        Institution createdInstitution = institutionRepository.save(institutionDTO.getInstitution());

        institutionDTO.setInstitution(createdInstitution);

        Message<InstitutionDTO> message = MessageBuilder.withPayload(institutionDTO).build();
        clientInstitutionCreatedChannel.send(message);

        return createdInstitution;
    }

    @Override
    public Institution createInstitution(Institution institution) {
        if (!institutionRepository.findByInstitutionNameIgnoreCase(institution.getInstitutionName()).isEmpty())
            throw new BadRequestRestApiException()
                    .userMessage("Sorry. Duplicate institution exists.")
                    .developerMessage("Duplicate institution exists.");

        if(institution.getRegistrationNumber() != null)
            if (!institutionRepository.findByRegistrationNumberIgnoreCase(institution.getRegistrationNumber()).isEmpty())
                throw new BadRequestRestApiException()
                        .userMessage("Sorry. Duplicate institution exists.")
                        .developerMessage("Duplicate institution exists.");

        Institution createdInstitution = institutionRepository.save(institution);

        Message<Institution> message = MessageBuilder.withPayload(createdInstitution).build();
        institutionCreatedChannel.send(message);

        return createdInstitution;
    }

    @Override
    public Institution validate(UUID institutionPublicId) {
        return institutionRepository.findByPublicIdAndDeletedIsFalse(institutionPublicId)
                .orElseThrow(() -> new ResourceNotFoundRestApiException()
                        .developerMessage("Institution does not exist.")
                        .userMessage("Sorry. Institution does not exist."));
    }

    @Override
    public Optional<Institution> fetchByPublicId(UUID institutionPublicId) {
        return institutionRepository.findByPublicIdAndDeletedIsFalse(institutionPublicId);
    }

    @Override
    public Page<Institution> fetchInstitutions(String searchQueryParam, Pageable pageable) {
        return institutionRepository.findByInstitutionNameIgnoreCase(searchQueryParam, pageable);
    }

    @Override
    public Page<Institution> fetchInstitutions(Pageable pageable) {
        return institutionRepository.findByDeletedIsFalse(pageable);
    }

    @Override
    public Institution update(UUID institutionPublicId, Institution institution, SystemUser by) {
        this.validate(institutionPublicId);

        if(institution.getRegistrationNumber() != null)
            if (!institutionRepository.findByRegistrationNumberIgnoreCaseAndIdNot(
                    institution.getRegistrationNumber(),
                    institution.getId()).isEmpty())
                throw new BadRequestRestApiException()
                        .userMessage("Sorry. Duplicate institution exists.")
                        .developerMessage("Duplicate institution exists.");

        institution.setUpdateDate(new Date());
        institution.setUpdatedBy(by.getPublicId());

        return institutionRepository.save(institution);
    }

}