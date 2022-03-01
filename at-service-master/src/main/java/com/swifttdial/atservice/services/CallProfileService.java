package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.CallProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CallProfileService {

    CallProfile createProfile(CallProfile callProfile);

    CallProfile fetchProfileByPublicId(UUID publicId);

    Page<CallProfile> fetchProfilesSorted(Pageable pageable);

    CallProfile updateProfile(UUID publicId, CallProfile updateCallProfile);

    void deleteProfile(UUID publicId);
}
