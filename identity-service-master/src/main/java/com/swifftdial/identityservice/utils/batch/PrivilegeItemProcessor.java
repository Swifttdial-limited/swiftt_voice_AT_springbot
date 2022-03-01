package com.swifftdial.identityservice.utils.batch;

import com.swifftdial.identityservice.domains.Privilege;
import org.springframework.batch.item.ItemProcessor;

public class PrivilegeItemProcessor implements ItemProcessor<Privilege, Privilege> {

    @Override
    public Privilege process(final Privilege privilege) throws Exception {
        final String privilegeGroup = privilege.getPrivilegeGroup().toUpperCase();
        final String code = privilege.getCode().toUpperCase();
        final String description = privilege.getDescription();
        final String name = privilege.getName();
        final Boolean global = privilege.isGlobal();
        final Boolean assignedByDefault = privilege.isAssignedByDefault();

        return new Privilege(privilegeGroup, code, name, description, global, assignedByDefault);
    }
}
