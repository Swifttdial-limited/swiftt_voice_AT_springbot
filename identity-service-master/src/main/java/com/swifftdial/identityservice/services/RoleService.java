package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.domains.dto.RoleAction;
import com.swifftdial.identityservice.domains.dto.RoleUpdateDTO;
import com.swifftdial.identityservice.domains.Actor;
import com.swifftdial.identityservice.domains.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Created by gathigai on 9/15/16.
 */
public interface RoleService {

    Role createRole(Role role, Actor actor);

    Page<Role> fetchSortedRoles(UUID tenant, Pageable pageable);

    Role updateRole(UUID tenant, RoleUpdateDTO updatedRole);

    void deleteRole(Role role);

    Page<Role> searchRoleByName(UUID tenant, String searchQueryParam, Pageable pageable);

    Role save(Role newRole);

    Role validate(UUID tenant, UUID rolePublicId);

    Role applyAction(UUID tenant, UUID rolePublicId, RoleAction roleAction);

    List<Role> findByActor(UUID tenant, Actor actor);
}
