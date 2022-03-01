package com.swifftdial.identityservice.web;

import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.domains.*;
import com.swifftdial.identityservice.services.UserService;
import com.swifftdial.identityservice.utils.converters.LoggedInUserDetailsToUserConverter;
import com.swifftdial.identityservice.utils.validators.Validators;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import com.swifftdial.identityservice.domains.dto.UserAction;
import com.swifftdial.identityservice.domains.dto.UserDto;
import com.swifftdial.identityservice.domains.dto.UserUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserRestController {

    private final LoggedInUserDetailsToUserConverter loggedInUserDetailsToUserConverter;
    private final UserService userService;

    public UserRestController(LoggedInUserDetailsToUserConverter loggedInUserDetailsToUserConverter, UserService userService) {
        this.loggedInUserDetailsToUserConverter = loggedInUserDetailsToUserConverter;
        this.userService = userService;
    }

    @PreAuthorize("hasAuthority('CREATE_USER')")
    @JsonView(User.Full.class)
    @PostMapping
    public User createUser(@RequestBody UserDto userDto, LoggedInUserDetails loggedInUserDetails) {
        return userService.createUser(userDto, loggedInUserDetails.getInstitution());
    }

    @PreAuthorize("hasAuthority('READ_USERS')")
    @JsonView(User.Summary.class)
    @GetMapping
    public Page<User> getUsers(@RequestParam(name = "enabled", required = false) Boolean enabled,
                               @RequestParam(name = "username", required = false) String username,
                               @RequestParam(name = "department", required = false) UUID departmentPublicId,
                               @PathVariable(name = "role", required = false) UUID rolePublicId,
                               @PageableDefault(sort = "firstName", size = 20, direction = Sort.Direction.ASC) Pageable pageable,
                               LoggedInUserDetails loggedInUserDetails) {
        if(Validators.allNotEqualNull(enabled) && Validators.allEqualNull(username, departmentPublicId, rolePublicId))
            return userService.fetchUserByEnabled(loggedInUserDetails.getInstitution(), enabled, pageable);
        else if(Validators.allNotEqualNull(username) && Validators.allEqualNull(enabled, departmentPublicId, rolePublicId))
            return userService.searchUserByUsername(loggedInUserDetails.getInstitution(), username, pageable);
        else if(Validators.allNotEqualNull(username, enabled) && Validators.allEqualNull(departmentPublicId, rolePublicId))
            return userService.searchUserByUsernameAndEnabled(loggedInUserDetails.getInstitution(), username, enabled, pageable);
        else if(Validators.allNotEqualNull(departmentPublicId, enabled) && Validators.allEqualNull(username, rolePublicId))
            return userService.fetchByDepartment(loggedInUserDetails.getInstitution(), departmentPublicId, enabled, pageable);
        else if(Validators.allNotEqualNull(rolePublicId) && Validators.allEqualNull(enabled, username, departmentPublicId))
            return userService.fetchByRole(loggedInUserDetails.getInstitution(), rolePublicId, pageable);
        else if(Validators.allNotEqualNull(rolePublicId, enabled) && Validators.allEqualNull(username, departmentPublicId))
            return userService.fetchByRoleAndEnabledIs(loggedInUserDetails.getInstitution(), rolePublicId, enabled, pageable);
        else
            return userService.fetchSortedUsers(loggedInUserDetails.getInstitution(), pageable);
    }

    @PreAuthorize("hasAuthority('READ_USERS')")
    @JsonView(User.Full.class)
    @GetMapping("/{userPublicId}")
    public User getUserByUserId(@PathVariable("userPublicId") UUID userPublicId,
                                LoggedInUserDetails loggedInUserDetails) {
        return userService.fetchUserByPublicId(loggedInUserDetails.getInstitution(), userPublicId);
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PatchMapping("/{userPublicId}")
    public User updateUser(@PathVariable UUID userPublicId,
                           @RequestBody UserUpdateDTO updatedUser,
                           LoggedInUserDetails loggedInUserDetails) {
        userService.fetchUserByPublicId(loggedInUserDetails.getInstitution(), userPublicId);
        return userService.updateUser(loggedInUserDetails.getInstitution(), updatedUser);
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PostMapping("/{userPublicId}/actions")
    public void applyAction(@PathVariable("userPublicId") UUID userPublicId,
                            @RequestBody UserAction userAction,
                            LoggedInUserDetails loggedInUserDetails) {
        if(userAction.getUserActionType().equals(UserAction.UserActionType.REQUEST_PASSWORD_RESET)) {
            userService.resetUserPassword(userService.fetchUserByPublicId(loggedInUserDetails.getInstitution(), userPublicId));
        }
    }

    @PreAuthorize("hasAuthority('DELETE_USER')")
    @DeleteMapping("/{userPublicId}")
    public void deleteUser(@PathVariable("userPublicId") UUID userPublicId,
                           LoggedInUserDetails loggedInUserDetails) {
        userService.deleteUser(userService.fetchUserByPublicId(loggedInUserDetails.getInstitution(), userPublicId));
    }

    @PreAuthorize("hasAuthority('CREATE_NEXT_OF_KIN')")
    @PostMapping("/{userPublicId}/nextOfKins")
    public NextOfKin addNextOfKin(@PathVariable("userPublicId") UUID userPublicId,
                                  @RequestBody NextOfKin nextOfKin,
                                  LoggedInUserDetails loggedInUserDetails){
        return userService.createNextOfKin(loggedInUserDetails.getInstitution(), userPublicId, nextOfKin);
    }

    @PreAuthorize("hasAuthority('READ_NEXT_OF_KINS')")
    @GetMapping("/{userPublicId}/nextOfKins")
    public Page<NextOfKin> getListOfUserNextOfKin(@PathVariable("userPublicId") UUID userPublicId,
                                                  Pageable pageable,
                                                  LoggedInUserDetails loggedInUserDetails){
        return userService.fetchUserNextOfKin(loggedInUserDetails.getInstitution(), userPublicId, pageable);
    }

    @PreAuthorize("hasAuthority('UPDATE_NEXT_OF_KIN')")
    @PatchMapping("/{userPublicId}/nextOfKins/{nextOfKinPublicId}")
    public NextOfKin updateNextOfKin(@PathVariable("userPublicId") UUID userPublicId,
                                     @PathVariable("nextOfKinPublicId") UUID nextOfKinPublicId,
                                     @RequestBody NextOfKin nextOfKin,
                                     LoggedInUserDetails loggedInUserDetails){
        return userService.updateNextOfKin(loggedInUserDetails.getInstitution(), userPublicId, nextOfKinPublicId, nextOfKin);
    }

    @PreAuthorize("hasAuthority('DELETE_NEXT_OF_KIN')")
    @DeleteMapping("/{userPublicId}/nextOfKins/{nextOfKinPublicId}")
    public void deleteNextOfKin(@PathVariable("userPublicId") UUID userPublicId,
                                @PathVariable("nextOfKinPublicId") UUID nextOfKinPublicId,
                                LoggedInUserDetails loggedInUserDetails) {
        userService.deleteNextOfKin(loggedInUserDetails.getInstitution(), userPublicId, nextOfKinPublicId);
    }

    @JsonView(User.Full.class)
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PostMapping("/{userPublicId}/roles")
    public User addRole(@PathVariable("userPublicId") UUID userPublicId,
                        @RequestBody Role role,
                        LoggedInUserDetails loggedInUserDetails){
        return userService.addRole(loggedInUserDetails.getInstitution(), userPublicId, role);
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @DeleteMapping("/{userPublicId}/roles/{rolePublicId}")
    public void deleteRole(@PathVariable("userPublicId") UUID userPublicId,
                           @PathVariable("rolePublicId") UUID rolePublicId,
                           LoggedInUserDetails loggedInUserDetails){
        userService.removeRole(loggedInUserDetails.getInstitution(),
                userPublicId, rolePublicId);
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PostMapping("/{userPublicId}/userIdentification")
    public UserIdentification addUserIdentification(@PathVariable UUID userPublicId,
                                                    @RequestBody UserIdentification userIdentification,
                                                    LoggedInUserDetails loggedInUserDetails) {
        return userService.addUserIdentification(loggedInUserDetails.getInstitution(), userPublicId, userIdentification);
    }

    @PreAuthorize("hasAuthority('READ_USERS')")
    @GetMapping("/{userPublicId}/userIdentification/{userIdentificationPublicId}")
    public UserIdentification fetchUserIdentification(@PathVariable UUID userPublicId,
                                                      @PathVariable UUID userIdentificationPublicId,
                                                      LoggedInUserDetails loggedInUserDetails) {
        return userService.fetchUserIdentification(loggedInUserDetails.getInstitution(), userPublicId, userIdentificationPublicId);
    }

    @PreAuthorize("hasAuthority('READ_USERS')")
    @GetMapping("/{userPublicId}/userIdentification")
    public List<UserIdentification> fetchUserIdentifications(@PathVariable UUID userPublicId,
                                                             LoggedInUserDetails loggedInUserDetails){
        return userService.fetchUserIdentifications(loggedInUserDetails.getInstitution(), userPublicId);
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @DeleteMapping("/{userPublicId}/userIdentification/{userIdentificationPublicId}")
    public void removeUserIdentifications(@PathVariable UUID userPublicId,
                                          @PathVariable UUID userIdentificationPublicId,
                                          LoggedInUserDetails loggedInUserDetails) {
        userService.removeUserIdentification(loggedInUserDetails.getInstitution(), userPublicId, userIdentificationPublicId);
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PostMapping("/{userPublicId}/userSpecializations")
    public UserSpecialization addUserSpecialization(@PathVariable UUID userPublicId,
                                                    @RequestBody UserSpecialization userSpecialization,
                                                    LoggedInUserDetails loggedInUserDetails) {
        return userService.addUserSpecialization(loggedInUserDetails.getInstitution(), userPublicId, userSpecialization);
    }

    @PreAuthorize("hasAuthority('READ_USERS')")
    @GetMapping("/{userPublicId}/userSpecializations")
    public Page<UserSpecialization> fetchUserSpecialization(@PathVariable UUID userPublicId,
                                                             @PageableDefault Pageable pageable,
                                                             LoggedInUserDetails loggedInUserDetails){
        return userService.fetchUserSpecializations(loggedInUserDetails.getInstitution(), userPublicId, pageable);
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PatchMapping("/{userPublicId}/userSpecializations/{userSpecializationPublicId}")
    public UserSpecialization updateUserSpecialization(@PathVariable UUID userPublicId,
                                                       @PathVariable UUID userSpecializationPublicId,
                                                       @RequestBody UserSpecialization updatedUserSpecialization,
                                                       LoggedInUserDetails loggedInUserDetails) {
        return userService.updateUserSpecialization(
                loggedInUserDetails.getInstitution(),
                userPublicId,
                userSpecializationPublicId,
                updatedUserSpecialization,
                loggedInUserDetailsToUserConverter.convert(loggedInUserDetails));
    }

    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @DeleteMapping("/{userPublicId}/userSpecializations/{userSpecializationPublicId}")
    public void removeUserSpecializations(@PathVariable UUID userPublicId,
                                          @PathVariable UUID userSpecializationPublicId,
                                          LoggedInUserDetails loggedInUserDetails) {
        userService.removeUserSpecialization(
                loggedInUserDetails.getInstitution(),
                userPublicId,
                userSpecializationPublicId,
                loggedInUserDetailsToUserConverter.convert(loggedInUserDetails));
    }
}