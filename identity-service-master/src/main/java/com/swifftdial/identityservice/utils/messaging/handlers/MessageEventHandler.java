package com.swifftdial.identityservice.utils.messaging.handlers;

import com.swifftdial.identityservice.datatypes.Gender;
import com.swifftdial.identityservice.datatypes.UserType;
import com.swifftdial.identityservice.domains.Actor;
import com.swifftdial.identityservice.domains.Role;
import com.swifftdial.identityservice.domains.User;
import com.swifftdial.identityservice.domains.dto.Institution;
import com.swifftdial.identityservice.domains.dto.InstitutionDTO;
import com.swifftdial.identityservice.repositories.PrivilegeRepository;
import com.swifftdial.identityservice.services.ActorService;
import com.swifftdial.identityservice.services.RoleService;
import com.swifftdial.identityservice.services.UserService;
import com.swifftdial.identityservice.utils.messaging.StreamChannels;
import com.swifftdial.identityservice.domains.dto.UserDto;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * Created by gathigai on 3/7/17.
 */
@Component
public class MessageEventHandler {

    private final ActorService actorService;
    private final PrivilegeRepository privilegeRepository;
    private final RoleService roleService;
    private final UserService userService;

    public MessageEventHandler(ActorService actorService, PrivilegeRepository privilegeRepository,
                               RoleService roleService, UserService userService) {
        this.actorService = actorService;
        this.privilegeRepository = privilegeRepository;
        this.roleService = roleService;
        this.userService = userService;
    }

    @StreamListener(StreamChannels.INSTITUTION_CREATED)
    public void newInstitutionHandler(Institution institution) {
        this.createDefaultUser(institution);
    }

    @StreamListener(StreamChannels.CLIENT_INSTITUTION_CREATED)
    public void newClientInstitutionHandler(InstitutionDTO institutionDTO) {
        this.createClientUser(institutionDTO);
    }

    @StreamListener(StreamChannels.SYSTEM_USER_INGESTION_QUEUE)
    public void systemUserIngestionQueueHandler(UserDto user) {
        userService.createUser(user, user.getInstitution());
    }

    private void createDefaultUser(Institution institution) {

        Actor administratorActor = new Actor("Administrator", "SyHos administrators user group");
        administratorActor.setTenant(institution.getPublicId());
        administratorActor.setModifiable(false);
        administratorActor = actorService.createActor(administratorActor);

        Role administratorRole = new Role("System Administrator", administratorActor);
        administratorRole.setModifiable(false);
        administratorRole.setTenant(institution.getPublicId());
        privilegeRepository.findByGlobalIsTrue().forEach(administratorRole::addPrivilege);
        administratorRole = roleService.createRole(administratorRole, administratorActor);

        User defaultUser = new User();
        defaultUser.setFirstName("System");
        defaultUser.setSurname("Administrator");
        defaultUser.setDateOfBirth(new Date());
        defaultUser.setTenant(institution.getPublicId());
        defaultUser.setUsername(institution.getEmailAddress());
        defaultUser.setGender(Gender.MALE);
        defaultUser.setUserType(UserType.SYSTEM_USER);
        defaultUser.setModifiable(false);

        userService.createUser(new UserDto(defaultUser, Collections.singletonList(administratorRole)), institution.getPublicId());
    }

    private void createClientUser(InstitutionDTO institutionDTO) {
        String actorName = "Administrator";
        List<Actor> actors = actorService.findByActorName(institutionDTO.getInstitution().getPublicId(), actorName);
        Actor administratorActor;

        if (actors.isEmpty()) {
            administratorActor = new Actor("Administrator", institutionDTO.getInstitution().getInstitutionName() + " administrators user group");
            administratorActor.setTenant(institutionDTO.getInstitution().getPublicId());
            administratorActor.setModifiable(false);
            administratorActor = actorService.createActor(administratorActor);
        } else {
            administratorActor = actors.get(0);
        }

        List<Role> roles = roleService.findByActor(institutionDTO.getInstitution().getPublicId(), administratorActor);
        Role administratorRole;
        if (roles.isEmpty()){
            administratorRole = new Role("System Administrator", administratorActor);
            administratorRole.setModifiable(false);
            administratorRole.setTenant(institutionDTO.getInstitution().getPublicId());
            privilegeRepository.findByGlobalIsTrue().forEach(administratorRole::addPrivilege);
            administratorRole = roleService.createRole(administratorRole, administratorActor);
        } else {
            administratorRole = roles.get(0);
        }

        User defaultUser = new User();
        defaultUser.setFirstName(institutionDTO.getUser().getFirstName());
        defaultUser.setSurname(institutionDTO.getUser().getSurname());
        defaultUser.setOtherNames(institutionDTO.getUser().getOtherNames());
        defaultUser.setDateOfBirth(new Date());
        defaultUser.setTenant(institutionDTO.getInstitution().getPublicId());
        defaultUser.setUsername(institutionDTO.getUser().getEmailAddress());
        defaultUser.setEmailAddress(institutionDTO.getUser().getEmailAddress());
        defaultUser.setPhoneNumber(institutionDTO.getUser().getPhoneNumber());
        defaultUser.setGender(Gender.MALE);
        defaultUser.setUserType(UserType.SYSTEM_USER);
        defaultUser.setModifiable(false);

        userService.createUser(new UserDto(defaultUser, Collections.singletonList(administratorRole)), institutionDTO.getInstitution().getPublicId());
    }
}
