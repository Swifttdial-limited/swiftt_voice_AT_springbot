package com.swifftdial.identityservice.services;


import com.swifftdial.identityservice.repositories.PrivilegeRepository;
import com.swifftdial.identityservice.domains.Privilege;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Created by gathigai on 9/15/16.
 */
@Service
public class PrivilegeServiceImpl implements PrivilegeService {

    private final PrivilegeRepository privilegeRepository;

    public PrivilegeServiceImpl(PrivilegeRepository privilegeRepository) {
        this.privilegeRepository = privilegeRepository;
    }

    @Override
    public Page<Privilege> fetchGlobalPrivileges(Pageable pageable) {
        return privilegeRepository.findByGlobalIsTrue(pageable);
    }

    @Override
    public Long countPrivileges() {
        return privilegeRepository.count();
    }

    @Override
    public Optional<Privilege> fetchByPrivilegeCode(String code) {
        return privilegeRepository.findByCode(code);
    }

    @Override
    public void createPrivilege(Privilege privilege) {
        privilegeRepository.save(privilege);
    }

}
