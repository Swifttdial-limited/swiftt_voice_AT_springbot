package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.Ivr;
import com.swifttdial.atservice.domains.IvrOption;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IvrService {

    Ivr create(Ivr ivr);
    Ivr fetchByPublicId(UUID publicId);
    Page<Ivr> fetchSorted(Pageable pageable);
    Ivr update(UUID publicId, Ivr ivr);
    void delete(UUID publicId);
//    IvrOption addIvrOptions(UUID ivrPublicId, IvrOption ivrOption);

    Ivr fetchByTenant(UUID tenant);
}
