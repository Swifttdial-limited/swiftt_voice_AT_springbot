package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.datatypes.UserType;
import com.swifftdial.identityservice.domains.*;
import com.swifftdial.identityservice.domains.dto.AgentDto;
import com.swifftdial.identityservice.domains.dto.SystemUser;
import com.swifftdial.identityservice.repositories.UserIdentificationRepository;
import com.swifftdial.identityservice.repositories.UserRepository;
import com.swifftdial.identityservice.repositories.UserSpecializationRepository;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.exceptions.ConstraintValidationException;
import com.swifftdial.identityservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifftdial.identityservice.utils.messaging.StreamChannels;
import com.swifftdial.identityservice.domains.dto.UserDto;
import com.swifftdial.identityservice.domains.dto.UserUpdateDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Value("${custom.default-user-password}")
    private String defaultUserPassword;

    private final UserRepository userRepository;
    private final UserIdentificationRepository userIdentificationRepository;
    private final UserSpecializationRepository userSpecializationRepository;
    private final MessageChannel userUpdatedChannel;
    private final MessageChannel agentCreated;
    private final MessageChannel userDeleted;
    private final NextOfKinService nextOfKinService;
    private final RoleService roleService;

    public UserServiceImpl(UserRepository userRepository, UserIdentificationRepository userIdentificationRepository,
                           UserSpecializationRepository userSpecializationRepository, NextOfKinService nextOfKinService,
                           RoleService roleService, StreamChannels channels) {
        this.userRepository = userRepository;
        this.userIdentificationRepository = userIdentificationRepository;
        this.userSpecializationRepository = userSpecializationRepository;
        this.nextOfKinService = nextOfKinService;
        this.roleService = roleService;
        this.userUpdatedChannel = channels.userUpdated();
        this.agentCreated = channels.agentCreated();
        this.userDeleted = channels.userDeleted();
    }

    @Override
    public User createUser(UserDto userDto, UUID institution) {
        try {
            userDto.getUser().setTenant(institution);

            if(!userDto.getUser().getUserType().equals(UserType.SYSTEM_USER)) {
                if(userDto.getUser().getGender() == null) {
                    throw new BadRequestRestApiException()
                            .developerMessage("Gender cannot be null")
                            .userMessage("Sorry. Gender must be specified");
                } else if(userDto.getUser().getDateOfBirth() == null) {
                    throw new BadRequestRestApiException()
                            .developerMessage("Date of Birth cannot be null")
                            .userMessage("Sorry. Date of Birth must be specified");
                } else if(userDto.getUser().getDateOfBirth().after(new Date())) {
                    throw new BadRequestRestApiException()
                            .developerMessage("The date of birth is a future date")
                            .userMessage("The date of birth is a future date");
                } else if(userDto.getUser().getReligion() == null)
                    throw new BadRequestRestApiException()
                            .developerMessage("Religion cannot be null")
                            .userMessage("Sorry. Religion cannot be null");
                else if(userDto.getUser().getCountryOfOrigin() == null)
                    throw new BadRequestRestApiException()
                            .developerMessage("Country of origin cannot be null")
                            .userMessage("Sorry. Country of origin cannot be null");
            } else {
                if(!userRepository.findByUsernameIgnoreCase(userDto.getUser().getUsername()).isEmpty())
                    throw new BadRequestRestApiException()
                            .developerMessage("Sorry. That username already exists")
                            .userMessage("Sorry. That username already exists");

                if (userDto.getUser().getEmailAddress() != null) {
                    List<User> foundUsers = userRepository.findByEmailAddressIgnoreCase(userDto.getUser().getEmailAddress());
                    if (!foundUsers.isEmpty())
                        throw new BadRequestRestApiException()
                                .developerMessage("Sorry. That email address already exists")
                                .userMessage("Sorry. That email address already exists");
                }

                userDto.getUser().setDateOfBirth(new Date());
                userDto.getUser().setPassword(defaultUserPassword);
                userDto.getUser().setForcePasswordReset(true);
            }

            User createdUser = userRepository.save(userDto.getUser());

            userDto.getUserIdentifications()
                    .forEach(userIdentification ->
                            addUserIdentification(createdUser.getTenant(), createdUser.getPublicId(), userIdentification));

            userDto.getNextOfKins()
                    .forEach(nextOfKin ->
                            createNextOfKin(createdUser.getTenant(), createdUser.getPublicId(), nextOfKin));

            if(!userDto.getRoles().isEmpty()) {
                userDto.getRoles().forEach(role -> addRole(createdUser, role));
            }

            userDto.getUser().setId(createdUser.getId());
            userDto.getUser().setPublicId(createdUser.getPublicId());
            userDto.getUser().setTenant(createdUser.getTenant());
            userDto.getUser().setEnabled(createdUser.isEnabled());

            if(userDto.isAgentProfile()) {
                AgentDto agentDto = new AgentDto();
                agentDto.setAgent(userDto.getAgent());
                agentDto.setUser(createdUser);
                agentDto.getUser().getRoles().removeAll(agentDto.getUser().getRoles());
                log.error("Agent creation" + agentDto.toString());
                Message<AgentDto> message = MessageBuilder.withPayload(agentDto).build();
                agentCreated.send(message);
            }

            return createdUser;
        } catch (DataIntegrityViolationException ex) {
            ex.printStackTrace();
            throw new ConstraintValidationException()
                    .userMessage("Sorry. ".concat(ex.getCause().getCause().getLocalizedMessage()))
                    .developerMessage("Sorry. ".concat(ex.getCause().getCause().getLocalizedMessage()));
        }

    }

    @Override
    public Page<User> fetchSortedUsers(UUID tenant, Pageable pageable) {
        return userRepository.findByTenantAndUsernameNotNullAndPasswordNotNull(tenant, pageable);
    }

    @Override
    public void resetUserPassword(User user) {
        user.setPassword(defaultUserPassword);
        user.setForcePasswordReset(true);
        userRepository.save(user);
    }

    @Override
    public User updateUser(UUID tenant, UserUpdateDTO user) {
        User foundUser = this.fetchUserByPublicId(tenant, user.getPublicId());

        if (!StringUtils.isEmpty(user.getEmailAddress())) {
            if(!userRepository.findByEmailAddressIgnoreCaseAndPublicIdNot(user.getEmailAddress(), foundUser.getPublicId()).isEmpty())
                throw new BadRequestRestApiException()
                        .developerMessage("Sorry. That email address already exists")
                        .userMessage("Sorry. That email address already exists");

            foundUser.setEmailAddress(user.getEmailAddress());
        }
        
        foundUser.setTitle(user.getTitle());
        foundUser.setFirstName(user.getFirstName());
        foundUser.setSurname(user.getSurname());
        foundUser.setOtherNames(user.getOtherNames());
        foundUser.setDateOfBirth(user.getDateOfBirth());
        foundUser.setGender(user.getGender());

        User updatedUser = userRepository.save(foundUser);

        if(user.getUserType().equals(UserType.PATIENT)) {
            Message<User> message = MessageBuilder.withPayload(updatedUser).build();
            userUpdatedChannel.send(message);
        }

        return updatedUser;
    }

    @Override
    public void updateUser(UUID tenant, User user) {
        this.fetchUserByPublicId(tenant, user.getPublicId());
        userRepository.save(user);
    }

    @Override
    public void deleteUser(User user) {
        user.setDeleted(true);
        User deletedUser = userRepository.save(user);
        Message<User> message = MessageBuilder.withPayload(deletedUser).build();
        userDeleted.send(message);
    }

    private User fetchUserByPublicId(UUID userPublicId) {
        return userRepository.findByPublicId(userPublicId)
                .orElseThrow(() -> new ResourceNotFoundRestApiException()
                        .userMessage("Sorry. User does not exist")
                        .developerMessage("User does not exist"));
    }

    @Override
    public User fetchUserByPublicId(UUID tenant, UUID userPublicId) {
        return userRepository.findByTenantAndPublicId(tenant, userPublicId)
                .orElseThrow(() -> new ResourceNotFoundRestApiException()
                .userMessage("Sorry. User does not exist")
                .developerMessage("User does not exist"));
    }

    @Override
    public NextOfKin createNextOfKin(UUID tenant, UUID userPublicId, NextOfKin nextOfKin) {
        User user = this.fetchUserByPublicId(tenant, userPublicId);

        nextOfKin.setUser(user);
        nextOfKin.setTenant(user.getTenant());

        return nextOfKinService.createNextOfKin(nextOfKin);
    }

    @Override
    public NextOfKin updateNextOfKin(UUID tenant, UUID userPublicId, UUID nextOfKinPublicId, NextOfKin nextOfKin) {
        fetchUserByPublicId(tenant, userPublicId);
        return nextOfKinService.update(nextOfKinPublicId, nextOfKin);
    }

    @Override
    public List<User> fetchUsersByUsername(String emailAddress) {
        return userRepository.findByUsernameIgnoreCase(emailAddress);
    }

    @Override
    public void deleteNextOfKin(UUID tenant, UUID userPublicId, UUID nextOfKinPublicId) {
        fetchUserByPublicId(tenant, userPublicId);
        nextOfKinService.delete(nextOfKinPublicId);
    }

    @Override
    public Page<NextOfKin> fetchUserNextOfKin(UUID tenant, UUID userPublicId, Pageable pageable) {
        fetchUserByPublicId(userPublicId);
        return nextOfKinService.fetchByUserPublicId(userPublicId, pageable);
    }

    @Override
    public UserIdentification addUserIdentification(UUID tenant, UUID userPublicId, UserIdentification userIdentification) {
        User user = fetchUserByPublicId(tenant, userPublicId);
        userIdentification.setUser(user);
        userIdentification.setTenant(user.getTenant());

        return userIdentificationRepository.save(userIdentification);
    }

    @Override
    public void removeUserIdentification(UUID tenant, UUID userPublicId, UUID... userIdentificationPublicIds) {
        User user = fetchUserByPublicId(tenant, userPublicId);
        user.getIdentifications().forEach(
                userIdentification -> Arrays
                        .stream(userIdentificationPublicIds)
                        .filter(uuid -> uuid.equals(userIdentification.getPublicId()))
                        .forEachOrdered(uuid -> {
                            userIdentificationRepository.delete(userIdentification);
                            user.getIdentifications().remove(userIdentification);
                        }));

        userRepository.save(user);
    }

    @Override
    public UserIdentification fetchUserIdentification(UUID tenant, UUID userPublicId, UUID userIdentificationPublicId) {
        User user = fetchUserByPublicId(tenant, userPublicId);
        return user.getIdentifications()
                .stream()
                .filter(userIdentification -> userIdentification.getPublicId().equals(userIdentificationPublicId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundRestApiException()
                        .userMessage("Sorry. User identification does not exist.")
                        .developerMessage("User identification does not exist. " + userIdentificationPublicId));
    }

    @Override
    public List<UserIdentification> fetchUserIdentifications(UUID tenant, UUID userPublicId) {
        return fetchUserByPublicId(tenant, userPublicId).getIdentifications();
    }

    @Override
    public UserSpecialization addUserSpecialization(UUID tenant, UUID userPublicId, UserSpecialization userSpecialization) {
        User user = fetchUserByPublicId(tenant, userPublicId);
        userSpecialization.setUser(user);
        userSpecialization.setTenant(user.getTenant());

        return userSpecializationRepository.save(userSpecialization);
    }

    @Override
    public Page<UserSpecialization> fetchUserSpecializations(UUID tenant, UUID userPublicId, Pageable pageable) {
        User user = fetchUserByPublicId(tenant, userPublicId);
        return userSpecializationRepository.findByTenantAndUserId(tenant, user.getId(), pageable);
    }

    @Override
    public UserSpecialization updateUserSpecialization(UUID tenant, UUID userPublicId, UUID userSpecializationPublicId,
                                                       UserSpecialization updatedUserSpecialization, SystemUser by) {
        User user = fetchUserByPublicId(tenant, userPublicId);
        Optional<UserSpecialization> found = userSpecializationRepository.findByTenantAndUserIdAndPublicId(tenant, user.getId(), userSpecializationPublicId);

        if(found.isPresent()) {
            found.get().setIdentification(updatedUserSpecialization.getIdentification());
            found.get().setIdentificationType(updatedUserSpecialization.getIdentificationType());
            found.get().setActor(updatedUserSpecialization.getActor());
            found.get().setUpdateDate(new Date());
//            updatedUserSpecialization.setUpdatedBy(by.getPublicId());
            return userSpecializationRepository.save(found.get());
        } else {
            throw new BadRequestRestApiException()
                    .developerMessage("User specialization does not exist.")
                    .userMessage("Sorry. User specialization does not exist");
        }
    }

    @Override
    public void removeUserSpecialization(UUID tenant, UUID userPublicId, UUID userSpecializationPublicId, SystemUser by) {
        User user = fetchUserByPublicId(tenant, userPublicId);
        userSpecializationRepository.findByTenantAndUserIdAndPublicId(tenant, user.getId(), userSpecializationPublicId)
                .ifPresent(userSpecialization -> {
                    userSpecialization.setDeleted(true);
                    userSpecialization.setDeleteDate(new Date());
                    userSpecialization.setDeletedBy(by.getPublicId());

                    userSpecializationRepository.save(userSpecialization);
                });
    }

    @Override
    public User addRole(User foundUser, Role role) {
        Role foundRole = roleService.validate(foundUser.getTenant(), role.getPublicId());
        foundUser.addRole(foundRole);
        return userRepository.save(foundUser);
    }

    @Override
    public User addRole(UUID tenant, UUID userPublicId, Role role) {
        final User user = this.fetchUserByPublicId(tenant, userPublicId);
        return this.addRole(user, role);
    }

    @Override
    public void removeRole(UUID tenant, UUID userPublicId, UUID rolePublicId) {
        final User user = this.fetchUserByPublicId(tenant, userPublicId);
        user.removeRole(roleService.validate(tenant, rolePublicId));
        userRepository.save(user);
    }

    @Override
    public Page<User> fetchUserByEnabled(UUID tenant, Boolean enabled, Pageable pageable) {
        return userRepository.findByTenantAndEnabledAndUsernameNotNullAndPasswordNotNull(tenant, enabled, pageable);
    }

    @Override
    public Page<User> searchUserByUsername(UUID tenant, String username, Pageable pageable) {
        return userRepository.findByTenantAndUsernameContainingIgnoreCaseAndDeletedIsFalse(tenant, username, pageable);
    }

    @Override
    public Page<User> searchUserByUsernameAndEnabled(UUID tenant, String username, Boolean enabled, Pageable pageable) {
        return userRepository.findByTenantAndUsernameContainingIgnoreCaseAndEnabledIsAndDeletedIsFalse(tenant, username, enabled, pageable);
    }

    @Override
    public Page<User> fetchByRole(UUID tenant, UUID rolePublicId, Pageable pageable) {
        roleService.validate(tenant, rolePublicId);
        return userRepository.findByRoles_PublicId(rolePublicId, pageable);
    }

    @Override
    public Page<User> fetchByRoleAndEnabledIs(UUID tenant, UUID rolePublicId, Boolean enabled, Pageable pageable) {
        roleService.validate(tenant, rolePublicId);
        return userRepository.findByRoles_PublicIdAndEnabledIs(rolePublicId, enabled, pageable);
    }

    @Override
    public Page<User> fetchByDepartment(UUID tenant, UUID departmentPublicId, Boolean enabled, Pageable pageable) {
        return userRepository.findByTenantAndRoles_DepartmentPublicIdAndEnabledIs(tenant, departmentPublicId, enabled, pageable);
    }

}
