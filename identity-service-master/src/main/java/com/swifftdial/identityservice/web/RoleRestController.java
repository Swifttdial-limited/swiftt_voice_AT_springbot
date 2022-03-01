package com.swifftdial.identityservice.web;

import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.domains.Actor;
import com.swifftdial.identityservice.domains.Role;
import com.swifftdial.identityservice.domains.User;
import com.swifftdial.identityservice.domains.dto.RoleAction;
import com.swifftdial.identityservice.domains.dto.RoleUpdateDTO;
import com.swifftdial.identityservice.services.ActorService;
import com.swifftdial.identityservice.services.RoleService;
import com.swifftdial.identityservice.services.UserService;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.validators.Validators;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.UUID;

/**
 * Created by gathigai on 9/15/16.
 */
@RestController
@RequestMapping("/roles")
public class RoleRestController {

    private final ActorService actorService;
    private final RoleService roleService;
    private final UserService userService;

    public RoleRestController(RoleService roleService, ActorService actorService, UserService userService) {
        this.roleService = roleService;
        this.actorService = actorService;
        this.userService = userService;
    }

    @PreAuthorize("hasAuthority('CREATE_ROLE')")
    @PostMapping
    public Role postRole(@RequestBody @Valid Role role, LoggedInUserDetails loggedInUserDetails) {
        Actor foundActor = actorService.fetchActorByPublicId(
                loggedInUserDetails.getInstitution(), role.getActor().getPublicId());

        role.setTenant(loggedInUserDetails.getInstitution());
        return roleService.createRole(role, foundActor);
    }

    @PreAuthorize("hasAuthority('READ_ROLES')")
    @JsonView(Role.Summary.class)
    @GetMapping
    public Page<Role> getRoles(@RequestParam(name = "name", required = false) String name,
                               @PageableDefault(sort = "name", size = 20) Pageable pageable,
                               LoggedInUserDetails loggedInUserDetails) {
        if(Validators.allNotEqualNull(name))
            if(name.length() > 2)
                return roleService.searchRoleByName(loggedInUserDetails.getInstitution(), name, pageable);
            else
                throw new BadRequestRestApiException()
                        .developerMessage("Search Query Parameter must be 3 characters or more")
                        .userMessage("Search Query Parameter must be 3 characters or more");
        else
            return roleService.fetchSortedRoles(loggedInUserDetails.getInstitution(), pageable);
    }

    @PreAuthorize("hasAuthority('READ_ROLES')")
    @JsonView(Role.Full.class)
    @GetMapping("/{rolePublicId}")
    public Role getRole(@PathVariable("rolePublicId") UUID rolePublicId,
                        LoggedInUserDetails loggedInUserDetails) {
        return roleService.validate(loggedInUserDetails.getInstitution(), rolePublicId);
    }

    @PreAuthorize("hasAuthority('UPDATE_ROLE')")
    @JsonView(Role.Summary.class)
    @PatchMapping("/{rolePublicId}")
    public Role patchRole(@PathVariable("rolePublicId") UUID rolePublicId,
                          @RequestBody @Valid RoleUpdateDTO updatedRole,
                          LoggedInUserDetails loggedInUserDetails) {
        roleService.validate(loggedInUserDetails.getInstitution(), rolePublicId);
        return roleService.updateRole(loggedInUserDetails.getInstitution(), updatedRole);
    }

    @PreAuthorize("hasAuthority('UPDATE_ROLE')")
    @JsonView(Role.Full.class)
    @PatchMapping("/{rolePublicId}/actions")
    public Role applyActionToRole(@PathVariable("rolePublicId") UUID rolePublicId,
                                  @RequestBody @Valid RoleAction roleAction,
                                  LoggedInUserDetails loggedInUserDetails) {
        roleService.validate(loggedInUserDetails.getInstitution(), rolePublicId);
        return roleService.applyAction(loggedInUserDetails.getInstitution(), rolePublicId, roleAction);
    }

    @PreAuthorize("hasAuthority('DELETE_ROLE')")
    @DeleteMapping("/{rolePublicId}")
    public void deleteRole(@PathVariable("rolePublicId") UUID rolePublicId, LoggedInUserDetails loggedInUserDetails) {
        Role foundRole = roleService.validate(loggedInUserDetails.getInstitution(), rolePublicId);
        roleService.deleteRole(foundRole);
    }

    @JsonView(User.Summary.class)
    @GetMapping("/{rolePublicId}/users")
    public Page<User> getUsersByRole(@PathVariable("rolePublicId") UUID rolePublicId,
                                     @PageableDefault Pageable pageable,
                                     LoggedInUserDetails loggedInUserDetails) {
        return userService.fetchByRole(loggedInUserDetails.getInstitution(), rolePublicId, pageable);
    }
}