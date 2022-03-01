package com.swifftdial.identityservice.web;

import com.swifftdial.identityservice.domains.Department;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import com.swifftdial.identityservice.services.DepartmentService;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.validators.Validators;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/departments")
public class DepartmentRestController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentRestController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PreAuthorize("hasAuthority('CREATE_DEPARTMENT')")
    @PostMapping
    public Department create(@RequestBody Department department,
                             LoggedInUserDetails loggedInUserDetails) {
        department.setTenant(loggedInUserDetails.getInstitution());
        return departmentService.create(department);
    }

    @PreAuthorize("hasAuthority('READ_DEPARTMENTS')")
    @GetMapping
    public Page<Department> getDepartments(@RequestParam(name = "departmentName", required = false) String departmentName,
                                           @RequestParam(name = "isBillingDepartment", required = false) Boolean isBillingDepartment,
                                           @RequestParam(name = "parentDepartment", required = false) UUID parentDepartmentPublicId,
                                           @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable,
                                           LoggedInUserDetails loggedInUserDetails) {

        if(Validators.allNotEqualNull(departmentName))
            if(departmentName.length() < 3)
                throw new BadRequestRestApiException()
                        .developerMessage("Search Query Parameter must be longer than 2 characters")
                        .userMessage("Search Query Parameter must be longer than 2 characters");

        if (Validators.allNotEqualNull(departmentName) && Validators.allEqualNull(isBillingDepartment)) {
            return departmentService.fetchByName(loggedInUserDetails.getInstitution(), departmentName, pageable);
        } else if (Validators.allNotEqualNull(isBillingDepartment) && Validators.allEqualNull(departmentName)) {
            return departmentService.fetchByIsBillingDepartment(
                    loggedInUserDetails.getInstitution(), isBillingDepartment, pageable);
        } else if (Validators.allNotEqualNull(departmentName, isBillingDepartment)) {
            return departmentService.fetchByNameAndIsBillingDepartment(
                    loggedInUserDetails.getInstitution(), departmentName, isBillingDepartment, pageable);
        } else if(Validators.allNotEqualNull(parentDepartmentPublicId) && Validators.allEqualNull(departmentName, isBillingDepartment))
            return departmentService.fetchByParentDepartment(
                    loggedInUserDetails.getInstitution(),
                    parentDepartmentPublicId,
                    pageable);
        else
            return departmentService.fetchDepartments(loggedInUserDetails.getInstitution(), pageable);
    }

    @PreAuthorize("hasAuthority('READ_DEPARTMENTS')")
    @GetMapping("/{departmentPublicId}")
    public Department getDepartment(@PathVariable("departmentPublicId") UUID departmentPublicId,
                                    LoggedInUserDetails loggedInUserDetails) {
        return departmentService.fetchByPublicId(loggedInUserDetails.getInstitution(), departmentPublicId);
    }

    @PreAuthorize("hasAuthority('UPDATE_DEPARTMENT')")
    @PatchMapping("/{departmentPublicId}")
    public Department update(@PathVariable("departmentPublicId") UUID departmentPublicId,
                             @RequestBody Department department,
                             LoggedInUserDetails loggedInUserDetails) {
        return departmentService.update(loggedInUserDetails.getInstitution(), departmentPublicId, department);
    }

    @PreAuthorize("hasAuthority('DELETE_DEPARTMENT')")
    @DeleteMapping("/{departmentPublicId}")
    public void delete(@PathVariable UUID departmentPublicId, LoggedInUserDetails loggedInUserDetails) {
        final Department foundDepartment = departmentService.fetchByPublicId(loggedInUserDetails.getInstitution(), departmentPublicId);
        departmentService.delete(loggedInUserDetails.getInstitution(), foundDepartment.getPublicId());
    }

}
