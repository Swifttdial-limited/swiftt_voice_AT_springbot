package com.swifttdial.licenceservice.services;

import com.swifttdial.licenceservice.repositories.LicenseRepository;
import com.swifttdial.licenceservice.domains.Institution;
import com.swifttdial.licenceservice.domains.Licence;
import com.swifttdial.licenceservice.utils.exceptions.ForbiddenRestApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class LicenseServiceImpl implements LicenseService {

    private final LicenseRepository licenseRepository;

    public LicenseServiceImpl(LicenseRepository licenseRepository) {
        this.licenseRepository = licenseRepository;
    }

    @Override
    public Licence createLicense(Institution institution, Licence license) {
        if(this.getLicensesByInstitution(institution .getPublicId())
                .stream()
                .filter(Licence::isActive)
                .anyMatch(l -> license.getCreatedDate().before(l.getExpiryDate())))
            throw new ForbiddenRestApiException()
                    .developerMessage("Another active license exists.")
                    .userMessage("Sorry, Another active license exists.");

        license.setInstitution(institution);
        license.setIssueDate(new Date());
        license.setActive(true);

        return licenseRepository.save(license);
    }

    private List<Licence> getLicensesByInstitution(UUID institutionPublicId) {
        return licenseRepository.findByInstitutionPublicIdAndDeletedIsFalse(institutionPublicId);
    }

}
