package com.swifftdial.identityservice.web;

import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.domains.IdentificationType;
import com.swifftdial.identityservice.domains.Religion;
import com.swifftdial.identityservice.domains.Title;
import com.swifftdial.identityservice.domains.User;
import com.swifftdial.identityservice.services.IdentificationTypeService;
import com.swifftdial.identityservice.services.ReligionService;
import com.swifftdial.identityservice.services.TitleService;
import com.swifftdial.identityservice.services.UserService;
import com.swifftdial.identityservice.utils.exceptions.ForbiddenRestApiException;
import com.swifftdial.identityservice.domains.dto.UserDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(value = "/internal")
public class InternalRestController {

    private final IdentificationTypeService identificationTypeService;
    private final ReligionService religionService;
    private final TitleService titleService;
    private final UserService userService;

    @Autowired
    public InternalRestController(IdentificationTypeService identificationTypeService,
                                  ReligionService religionService, TitleService titleService,
                                  UserService userService) {
        this.identificationTypeService = identificationTypeService;
        this.religionService = religionService;
        this.titleService = titleService;
        this.userService = userService;
    }

    /**
     * In use by ingestion service
     * @return
     */
    @GetMapping("/identificationTypes")
    public List<IdentificationType> fetchIdentificationTypes(@RequestParam(name = "tenant") UUID tenant) {
        return identificationTypeService.fetchIdentificationTypes(tenant);
    }

    /**
     * In use by ingestion service
     * @return
     */
    @GetMapping("/religions")
    public List<Religion> fetchReligions(@RequestParam(name = "tenant") UUID tenant) {
        return religionService.fetchReligions(tenant);
    }

    /**
     * In use by ingestion service
     * @return
     */
    @GetMapping("/titles")
    public List<Title> fetchTitles(@RequestParam(name = "tenant") UUID tenant) {
        return titleService.fetchTitles(tenant);
    }

    /**
     * API endpoint that returns a user object, used for login
     * @param username
     * @return
     */
    @JsonView(User.LoginView.class)
    @GetMapping("/users/search/byUsername")
    public User getUserByUsername(@RequestParam("username") String username) {
        final List<User> users = userService.fetchUsersByUsername(username);

        if(!users.isEmpty() && users.size() == 1)
            return users.get(0);
        else
            throw new ForbiddenRestApiException().developerMessage("Denied").userMessage("Denied");
    }

    @PostMapping("/users")
    public User createUser(@RequestBody UserDto user) {
        return userService.createUser(user, user.getInstitution());
    }

    @JsonView(User.Summary.class)
    @GetMapping("/users")
    public List<User> getUsersByEmailAddress(@RequestParam("emailAddress") String emailAddress) {
        return userService.fetchUsersByUsername(emailAddress);
    }
}
