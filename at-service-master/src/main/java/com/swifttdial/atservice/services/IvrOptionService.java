package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.IvrOption;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IvrOptionService {

    IvrOption create(IvrOption ivrOption);
    IvrOption fetchByPublicId(UUID publicId);
    Page<IvrOption> fetchAllByTenantPage(UUID tenant, Pageable pageable);
    IvrOption update(UUID publicId, IvrOption ivrOption);
    void delete(UUID publicId);
}
