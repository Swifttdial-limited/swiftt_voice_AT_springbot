package com.swifftdial.identityservice.utils.batch;

import com.swifftdial.identityservice.domains.Privilege;
import com.swifftdial.identityservice.services.PrivilegeService;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class PrivilegeItemWriter implements ItemWriter<Privilege>, InitializingBean {

    @Autowired
    private PrivilegeService privilegeService;

    @Override
    public void write(List<? extends Privilege> items) throws Exception {

        // check if privilege exists
        items.forEach(p -> {
            if(!privilegeService.fetchByPrivilegeCode(p.getCode()).isPresent())
                privilegeService.createPrivilege(p);
        });
    }

    @Override
    public void afterPropertiesSet() throws Exception {}
}
