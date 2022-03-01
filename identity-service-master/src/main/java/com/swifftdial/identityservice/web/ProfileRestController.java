package com.swifftdial.identityservice.web;

import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.domains.User;
import com.swifftdial.identityservice.domains.dto.ProfileAction;
import com.swifftdial.identityservice.services.UserService;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileRestController {

    private final UserService userService;

    public ProfileRestController(UserService userService) {
        this.userService = userService;
    }

    @JsonView(User.ProfileView.class)
    @PreAuthorize("hasAuthority('LOGIN_AUTHORIZED')")
    @GetMapping
    public User fetchUserProfile(LoggedInUserDetails loggedInUserDetails) {
        return userService.fetchUserByPublicId(loggedInUserDetails.getInstitution(),
                loggedInUserDetails.getPublicId());
    }

    @PreAuthorize("hasAuthority('LOGIN_AUTHORIZED')")
    @PostMapping("/actions")
    public void applyActionToProfile(@RequestBody ProfileAction profileAction,
                                     LoggedInUserDetails loggedInUserDetails) {

        if(profileAction.getActionType().equals(ProfileAction.ProfileActionType.CHANGE_PASSWORD)) {
            if(profileAction.getCurrentPassword() == null)
                throw new BadRequestRestApiException()
                        .developerMessage("Missing current password")
                        .userMessage("Sorry. You must specify current password.");

            if(profileAction.getPassword() == null || profileAction.getConfirmPassword() == null)
                throw new BadRequestRestApiException()
                        .developerMessage("Missing password or confirm password")
                        .userMessage("Sorry. You must specify password or confirm password");

            if(!profileAction.getPassword().equals(profileAction.getConfirmPassword()))
                throw new BadRequestRestApiException()
                        .developerMessage("Password and confirm password must match")
                        .userMessage("Sorry. Password and confirm password must match");

            User foundUser = userService.fetchUserByPublicId(loggedInUserDetails.getInstitution(), loggedInUserDetails.getPublicId());

            if(foundUser.matchPassword(profileAction.getCurrentPassword())) {
                foundUser.setPassword(profileAction.getPassword());
                foundUser.setForcePasswordReset(false);
                userService.updateUser(loggedInUserDetails.getInstitution(), foundUser);
            } else {
                throw new BadRequestRestApiException()
                        .developerMessage("Wrong current password.")
                        .userMessage("Sorry. Wrong current password specified.");
            }
        }

    }
}
