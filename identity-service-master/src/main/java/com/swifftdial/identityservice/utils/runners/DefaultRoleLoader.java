//package com.swifftdial.identityservice.utils.runners;
//
//import com.swifftdial.identityservice.datatypes.Gender;
//import com.swifftdial.identityservice.datatypes.UserType;
//import com.swifftdial.identityservice.domains.*;
//import com.swifftdial.identityservice.domains.dto.UserDto;
//import com.swifftdial.identityservice.repositories.PrivilegeRepository;
//import com.swifftdial.identityservice.repositories.RoleRepository;
//import com.swifftdial.identityservice.repositories.TitleRepository;
//import com.swifftdial.identityservice.services.ActorService;
//import com.swifftdial.identityservice.services.RoleService;
//import com.swifftdial.identityservice.services.UserService;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.core.annotation.Order;
//import org.springframework.stereotype.Component;
//
//import javax.transaction.Transactional;
//import java.util.*;
//
//@Component
//@Order(900)
//public class DefaultRoleLoader implements CommandLineRunner {
//
//    private final ActorService actorService;
//    private final PrivilegeRepository privilegeRepository;
//    private final RoleRepository roleRepository;
//    private final RoleService roleService;
//    private final TitleRepository titleRepository;
//    private final UserService userService;
//
//    public DefaultRoleLoader(ActorService actorService, PrivilegeRepository privilegeRepository,
//                             RoleRepository roleRepository, RoleService roleService,
//                             TitleRepository titleRepository, UserService userService) {
//        this.actorService = actorService;
//        this.privilegeRepository = privilegeRepository;
//        this.roleRepository = roleRepository;
//        this.roleService = roleService;
//        this.titleRepository = titleRepository;
//        this.userService = userService;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//        Actor administratorActor = null;
//        if(actorService.findByActorName("Administrator").isEmpty()) {
//            administratorActor = new Actor("Administrator", "SyHos administrators user group");
//            administratorActor.setModifiable(false);
//            administratorActor = actorService.createActor(administratorActor);
//        }
//
//        Role systemAdminiRole = null;
//        List<Role> foundRoles = roleService.findByRoleName("System Administrator");
//        if(foundRoles.isEmpty()) {
//            Role systemAdminRole = new Role("System Administrator", administratorActor);
//            systemAdminiRole = roleService.createRole(systemAdminRole, systemAdminRole.getActor());
//        } else if(foundRoles.size() == 1)
//            systemAdminiRole = foundRoles.get(0);
//
//        if(systemAdminiRole != null) {
//            for (Privilege p : privilegeRepository.findAll()) {
//                if (!systemAdminiRole.getPrivileges().contains(p)) {
//                    systemAdminiRole.addPrivilege(p);
//                }
//            }
//            systemAdminiRole = roleRepository.save(systemAdminiRole);
//        }
//
//        if(userService.fetchUserByUsername("system.administrator") == null) {
//            UserDto userDto = new UserDto();
//            User user = new User();
//
//            user.setFirstName("System");
//            user.setSurname("Administrator");
//            user.setDateOfBirth(new Date());
//            user.setUsername("system.administrator");
//            user.setGender(Gender.MALE);
//            user.setTitle(createTitleIfNotFound("Mr"));
//            user.setUserType(UserType.SYSTEM_USER);
//            user.setRoles(Collections.singletonList(systemAdminiRole));
//            user.setModifiable(false);
//
//            userDto.setUser(user);
//            userService.createUser(userDto, loggedInUserDetails.getInstitution());
//        }
//
//
//    }
//
//    @Transactional
//    Title createTitleIfNotFound(String titleName) {
//        List<Title> titles = titleRepository.findByNameIgnoreCase(titleName);
//        if(titles.isEmpty()) {
//            return titleRepository.save(new Title(titleName));
//        } else
//            return titles.get(0);
//    }
//}
