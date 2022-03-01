package com.swifftdial.identityservice.services;


import com.swifftdial.identityservice.domains.Privilege;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Created by gathigai on 9/15/16.
 */
public interface PrivilegeService {

    Page<Privilege> fetchGlobalPrivileges(Pageable pageable);

    Long countPrivileges();

    Optional<Privilege> fetchByPrivilegeCode(String code);

    void createPrivilege(Privilege privilege);
}
