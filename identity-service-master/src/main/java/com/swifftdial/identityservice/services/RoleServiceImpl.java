package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.domains.dto.RoleAction;
import com.swifftdial.identityservice.domains.dto.RoleUpdateDTO;
import com.swifftdial.identityservice.repositories.PrivilegeRepository;
import com.swifftdial.identityservice.repositories.RoleRepository;
import com.swifftdial.identityservice.repositories.UserRepository;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifftdial.identityservice.domains.Actor;
import com.swifftdial.identityservice.domains.Privilege;
import com.swifftdial.identityservice.domains.Role;
import com.swifftdial.identityservice.domains.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Created by gathigai on 9/15/16.
 */
@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PrivilegeRepository privilegeRepository;
    private final UserRepository userRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository,
                           PrivilegeRepository privilegeRepository,
                           UserRepository userRepository) {
        this.roleRepository = roleRepository;
        this.privilegeRepository = privilegeRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Role createRole(Role role, Actor actor) {
        if(!roleRepository.findByTenantAndNameIgnoreCase(role.getTenant(), role.getName()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate record found")
                    .userMessage("Sorry. Duplicate record found");

        role.setActor(actor);
        return roleRepository.save(role);
    }

    @Override
    public Page<Role> fetchSortedRoles(UUID tenant, Pageable pageable) {
        return roleRepository.findByTenant(tenant, pageable);
    }

    @Override
    public Role validate(UUID tenant, UUID rolePublicId) {
        return roleRepository.findByTenantAndPublicId(tenant, rolePublicId).orElseThrow(() ->
                new ResourceNotFoundRestApiException()
                        .developerMessage("Sorry. The role does not exist")
                        .userMessage("Sorry. The role does not exist"));
    }

    @Override
    public Role updateRole(UUID tenant, RoleUpdateDTO updatedRole) {
        final Role foundRole = this.validate(tenant, updatedRole.getPublicId());

        if(!roleRepository.findByTenantAndNameIgnoreCaseAndIdNot(
                tenant, updatedRole.getName(), foundRole.getId()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate record found")
                    .userMessage("Sorry. Duplicate record found");

        foundRole.setName(updatedRole.getName());
        foundRole.setDescription(updatedRole.getDescription());
        foundRole.setActor(updatedRole.getActor());
        foundRole.setDepartment(updatedRole.getDepartment());
        return roleRepository.save(foundRole);

    }

    @Override
    public void deleteRole(Role role) {
        role.getSystemUsers().forEach(user -> {
            user.removeRole(role);
            userRepository.save(user);
        });

        role.setDeleted(true);
        roleRepository.save(role);
    }

    private Role createRolePrivileges(Role foundRole, List<Privilege> privileges) {
        privileges.forEach(privilege -> {
            Optional<Privilege> foundPrivilege = privilegeRepository.findByCode(privilege.getCode());
            if (!foundPrivilege.isPresent())
                privileges.remove(privilege);
        });
        privileges.forEach(privilege -> {
            boolean match = foundRole.getPrivileges()
                    .stream()
                    .anyMatch(assignedPrivilege -> assignedPrivilege.getCode().equals(privilege.getCode()));
            if(!match)
                foundRole.addPrivilege(privilege);
        });
        return roleRepository.save(foundRole);
    }

    private Role createRoleUsers(UUID tenant, Role foundRole, List<User> users) {
        List<User> validatedActiveUsers = new ArrayList<>();
        users.forEach(user -> {
            Optional<User> validatedUser = userRepository.findByTenantAndPublicId(tenant, user.getPublicId());
            if(validatedUser.isPresent() && validatedUser.get().isEnabled()) {
                validatedActiveUsers.add(validatedUser.get());
            }
        });

        validatedActiveUsers.forEach(validatedActiveUser -> {
            if(!validatedActiveUser.getRoles().contains(foundRole)) {
                validatedActiveUser.addRole(foundRole);
                userRepository.save(validatedActiveUser);
            }
        });

        return roleRepository.findByTenantAndPublicId(foundRole.getTenant(), foundRole.getPublicId()).get();
    }

    @Override
    public Role applyAction(UUID tenant, UUID rolePublicId, RoleAction roleAction) {
        Role foundRole = this.validate(tenant, rolePublicId);

        if(roleAction.getActionType().equals(RoleAction.RoleActionType.ADD_PRIVILEGES)) {
            return createRolePrivileges(foundRole, roleAction.getPrivileges());
        } else if(roleAction.getActionType().equals(RoleAction.RoleActionType.ADD_USERS)) {
            return createRoleUsers(tenant, foundRole, roleAction.getUsers());
        } else if(roleAction.getActionType().equals(RoleAction.RoleActionType.REMOVE_PRIVILEGES)) {
            return removeRolePrivileges(foundRole, roleAction.getPrivileges());
        } else if(roleAction.getActionType().equals(RoleAction.RoleActionType.REMOVE_USERS)) {
            return removeRoleUsers(tenant, foundRole, roleAction.getUsers());
        } else
            return foundRole;
    }

    @Override
    public List<Role> findByActor(UUID tenant, Actor actor) {
        return roleRepository.findByTenantAndActorPublicId(tenant, actor.getPublicId());
    }

    @Override
    public Page<Role> searchRoleByName(UUID tenant, String searchQueryParam, Pageable pageable) {
        return roleRepository.findByTenantAndNameContainingIgnoreCase(tenant, searchQueryParam, pageable);
    }

    private Role removeRolePrivileges(Role foundRole, List<Privilege> privileges) {
        List<Privilege> existingPrivileges = new ArrayList<>();
        privileges.forEach(privilege -> {
            Optional<Privilege> foundPrivilege = privilegeRepository.findByCode(privilege.getCode());
            if (!foundPrivilege.isPresent())
                privileges.remove(privilege);
            else
                existingPrivileges.add(foundPrivilege.get());
        });
        existingPrivileges.forEach(foundRole::removePrivilege);
        return roleRepository.save(foundRole);
    }

    private Role removeRoleUsers(UUID tenant, Role foundRole, List<User> users) {
        List<User> existingUsers = new ArrayList<>();

        users.forEach(user -> {
            Optional<User> foundUser = userRepository.findByTenantAndPublicId(tenant, user.getPublicId());
            foundUser.ifPresent(existingUsers::add);
        });

        existingUsers.forEach(user -> {
            user.removeRole(foundRole);
            userRepository.save(user);
        });

        return foundRole;
    }

    @Override
    public Role save(Role newRole) {
        Role createdRole = roleRepository.save(newRole);
//        buildAndSendRoleCreatedEvent(createdRole); Todo Send role event created
        return createdRole;
    }

}
