package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.domains.*;
import com.swifftdial.identityservice.domains.dto.SystemUser;
import com.swifftdial.identityservice.domains.dto.UserUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

import com.swifftdial.identityservice.domains.dto.UserDto;

public interface UserService {

    User createUser(UserDto userDto, UUID institution);

    Page<User> fetchSortedUsers(UUID tenant, Pageable pageable);

    void resetUserPassword(User user);

    User updateUser(UUID tenant, UserUpdateDTO user);

    void updateUser(UUID tenant, User foundUser);

    void deleteUser(User user);

    User fetchUserByPublicId(UUID tenant, UUID userPublicId);

    NextOfKin createNextOfKin(UUID tenant, UUID userPublicId, NextOfKin nextOfKin);

    void deleteNextOfKin(UUID tenant, UUID userPublicId, UUID nextOfKinPublicId);

    Page<NextOfKin> fetchUserNextOfKin(UUID tenant, UUID userPublicId, Pageable pageable);

    UserIdentification addUserIdentification(UUID tenant, UUID userPublicId, UserIdentification userIdentification);

    void removeUserIdentification(UUID tenant, UUID userPublicId, UUID... userIdentificationPublicIds);

    UserIdentification fetchUserIdentification(UUID tenant, UUID userPublicId, UUID userIdentificationPublicId);

    List<UserIdentification> fetchUserIdentifications(UUID tenant, UUID userPublicId);

    UserSpecialization addUserSpecialization(UUID tenant, UUID userPublicId, UserSpecialization userSpecialization);

    Page<UserSpecialization> fetchUserSpecializations(UUID tenant, UUID userPublicId, Pageable pageable);

    UserSpecialization updateUserSpecialization(UUID tenant, UUID userPublicId, UUID userSpecializationPublicId,
                                                UserSpecialization updatedUserSpecialization, SystemUser by);

    void removeUserSpecialization(UUID tenant, UUID userPublicId, UUID userSpecializationPublicId, SystemUser by);

    User addRole(User foundUser, Role role);

    User addRole(UUID tenant, UUID userPublicId, Role role);

    void removeRole(UUID institution, UUID userPublicId, UUID rolePublicId);

    Page<User> fetchUserByEnabled(UUID tenant, Boolean enabled, Pageable pageable);

    Page<User> searchUserByUsername(UUID tenant, String username, Pageable pageable);

    Page<User> fetchByRole(UUID tenant, UUID rolePublicId, Pageable pageable);

    Page<User> fetchByRoleAndEnabledIs(UUID tenant, UUID rolePublicId, Boolean enabled, Pageable pageable);

    Page<User> fetchByDepartment(UUID tenant, UUID departmentPublicId, Boolean enabled, Pageable pageable);

    Page<User> searchUserByUsernameAndEnabled(UUID tenant, String username, Boolean enabled, Pageable pageable);

    NextOfKin updateNextOfKin(UUID tenant, UUID userPublicId, UUID nextOfKinPublicId, NextOfKin nextOfKin);

    List<User> fetchUsersByUsername(String emailAddress);
}
