package com.swifftdial.identityservice.utils.converters;

import com.swifftdial.identityservice.domains.OrganogramNode;
import com.swifftdial.identityservice.domains.dto.OrganogramNodeDTO;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class OrganogramNodeToOrganogramNodeDTOConverter implements Converter<OrganogramNode, OrganogramNodeDTO> {

    @Override
    public OrganogramNodeDTO convert(OrganogramNode source) {
        OrganogramNodeDTO result = new OrganogramNodeDTO();

        result.setNodeId(source.getId());
        result.setNodeVersion(source.getVersion());
        result.setNodePublicId(source.getPublicId());

        result.setId(source.getRole().getId());
        result.setVersion(source.getRole().getVersion());
        result.setPublicId(source.getRole().getPublicId());
        result.setName(source.getRole().getName());
        result.setDescription(source.getRole().getDescription());
        result.setActor(source.getRole().getActor());

        if(source.getRole().getDepartment() != null)
            result.setDepartment(source.getRole().getDepartment());

        if(source.getParentRole() != null)
            result.setParent(source.getParentRole());

        return result;
    }

}
