package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.repositories.NextOfKinRepository;
import com.swifftdial.identityservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifftdial.identityservice.domains.NextOfKin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
public class NextOfKinServiceImpl implements NextOfKinService {

    private final NextOfKinRepository nextOfKinRepository;

    @Autowired
    public NextOfKinServiceImpl(NextOfKinRepository nextOfKinRepository) {
        this.nextOfKinRepository = nextOfKinRepository;
    }

    @Override
    public NextOfKin createNextOfKin(NextOfKin nextOfKin) {
        return nextOfKinRepository.save(nextOfKin);
    }

    @Override
    public Page<NextOfKin> fetchByUserPublicId(UUID userPublicId, Pageable pageable) {
        return nextOfKinRepository.findByUserPublicId(userPublicId, pageable);
    }

    @Override
    public NextOfKin update(UUID publicId, NextOfKin nextOfKin) {
        NextOfKin foundNextOfKin = validate(publicId);

        if (Objects.equals(foundNextOfKin.getId(), nextOfKin.getId()))
            nextOfKinRepository.save(nextOfKin);

        return nextOfKin;
    }

    @Override
    public void delete(UUID publicId) {
        nextOfKinRepository.findByPublicId(publicId).ifPresent(
                nextOfKin -> {
                    nextOfKin.setDeleted(true);
                    nextOfKinRepository.save(nextOfKin);
                }
        );
    }

    private NextOfKin validate(UUID publicId) {
        return nextOfKinRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundRestApiException()
                        .userMessage("Sorry. The Next of kin does not exist.")
                        .developerMessage("The Next of kin does not exist."));
    }
}
