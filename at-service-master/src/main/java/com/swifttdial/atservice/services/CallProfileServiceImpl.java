package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.CallProfile;
import com.swifttdial.atservice.repositories.CallProfileRepository;
import com.swifttdial.atservice.utils.exceptions.BadRequestRestApiException;
import com.swifttdial.atservice.utils.exceptions.ResourceNotFoundRestApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
public class CallProfileServiceImpl implements CallProfileService {

    private final CallProfileRepository profileRepository;

    public CallProfileServiceImpl(CallProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public CallProfile createProfile(CallProfile callProfile) {
        if (Objects.isNull(callProfile.getTenant()) || !profileRepository.findByTenant(callProfile.getTenant()).isPresent()){
            throw new BadRequestRestApiException()
                    .developerMessage("Sorry. Profile already exists.")
                    .userMessage("Sorry. Profile already exists.");
        }
        return profileRepository.save(callProfile);
    }

    @Override
    public CallProfile fetchProfileByPublicId(UUID publicId) {
        return validate(publicId);
    }

    @Override
    public Page<CallProfile> fetchProfilesSorted(Pageable pageable) {
        return profileRepository.findAll(pageable);
    }

    @Override
    public CallProfile updateProfile(UUID publicId, CallProfile updateCallProfile) {
        CallProfile profile = validate(publicId);
        if (!Objects.equals(updateCallProfile.getId(), profile.getId())) {
            throw new BadRequestRestApiException()
                    .developerMessage("Sorry. Unable to update the profile.")
                    .userMessage("Sorry. Unable to update the profile.");
        }
        updateCallProfile.setId(profile.getId());
        updateCallProfile.setVersion(profile.getVersion());
        return profileRepository.save(updateCallProfile);
    }

    @Override
    public void deleteProfile(UUID publicId) {
        profileRepository.findByPublicId(publicId)
                .ifPresent(callProfile -> {
                    callProfile.setDeleted(true);
                    profileRepository.save(callProfile);
                });
    }

    CallProfile validate(UUID publicId) {
        return profileRepository.findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundRestApiException()
                                .developerMessage("Sorry. Profile not found.")
                                .userMessage("Sorry. Profile not found."));
    }
}
