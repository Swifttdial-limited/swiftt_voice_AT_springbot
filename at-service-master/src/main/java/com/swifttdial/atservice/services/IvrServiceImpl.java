package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.Ivr;
import com.swifttdial.atservice.domains.IvrOption;
import com.swifttdial.atservice.repositories.IvrRepository;
import com.swifttdial.atservice.utils.exceptions.BadRequestRestApiException;
import com.swifttdial.atservice.utils.exceptions.InternalServerErrorRestApiException;
import com.swifttdial.atservice.utils.exceptions.ResourceNotFoundRestApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;

@Slf4j
@Service
public class IvrServiceImpl implements IvrService {

    @Value("${custom.url}")
    private String url;

//    private final IvrOptionService ivrOptionService;

    private final IvrRepository ivrRepository;

    public IvrServiceImpl( IvrRepository ivrRepository) {
        this.ivrRepository = ivrRepository;
    }

    @Override
    public Ivr create(Ivr ivr) {

        log.error(ivr.getTenant().toString());

        if (StringUtils.isEmpty(ivr.getTenant().toString()))
            throw new BadRequestRestApiException()
                    .developerMessage("Sorry. Institution missing from the ivr.")
                    .userMessage("Sorry. Institution missing from the ivr.");

        ivrRepository.findByTenant(ivr.getTenant())
                .ifPresent(ivr1 -> {
                    throw new InternalServerErrorRestApiException()
                            .developerMessage("Sorry, ivr already exists.")
                            .userMessage("Sorry, ivr already exists.");
                });
        try {
            ivr.setInitialUrl(new URL(url + ivr.getTenant() + "/handle"));
        } catch (MalformedURLException e) {
            e.printStackTrace();
            throw new InternalServerErrorRestApiException()
                    .developerMessage("Sorry, an occurred error creating the IVR.")
                    .userMessage("Sorry, an occurred error creating the IVR.");
        }
        return ivrRepository.save(ivr);
    }

    @Override
    public Ivr fetchByPublicId(UUID publicId) {
        return validate(publicId);
    }

    @Override
    public Page<Ivr> fetchSorted(Pageable pageable) {
        return ivrRepository.findAll(pageable);
    }

    @Override
    public Ivr update(UUID publicId, Ivr ivr) {
        Ivr instituteIvr = validate(publicId);
        if (!instituteIvr.getId().equals(ivr.getId())) {
            throw new BadRequestRestApiException()
                    .developerMessage("The details sent do not match.")
                    .userMessage("Sorry. The details sent do not match.");
        }
        return ivrRepository.save(ivr);
    }

    @Override
    public void delete(UUID publicId) {
        ivrRepository.findByPublicId(publicId)
                .ifPresent(ivr -> {
                    ivr.setDeleted(true);
                    ivrRepository.save(ivr);
                });
    }

//    @Override
//    public IvrOption addIvrOptions(UUID ivrPublicId, IvrOption ivrOption) {
//        Ivr ivr = validate(ivrPublicId);
//        ivrOption.setIvr(ivr);
//        return ivrOptionService.create(ivrOption);
//    }

    @Override
    public Ivr fetchByTenant(UUID tenant) {
        return ivrRepository.findByTenant(tenant)
                .orElseThrow(() ->
                        new ResourceNotFoundRestApiException()
                                .developerMessage("Ivr for tenant " + tenant.toString() + " was not found")
                                .userMessage("Sorry, the ivr was not found."));
    }

    public Ivr validate(UUID publicId) {
        return ivrRepository.findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundRestApiException()
                                .developerMessage("Ivr " + publicId.toString() + " was not found")
                                .userMessage("Sorry, the ivr was not found."));
    }
}
