package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface DepartmentRepository extends GenericJpaRepository<Department, Long> {

    Page<Department> findByTenantAndParentDepartmentPublicId(UUID tenant, UUID publicId, Pageable pageable);

    Page<Department> findByTenantAndNameContainingIgnoreCase(UUID tenant, String name, Pageable pageable);

    Page<Department> findByTenantAndBillingAllowed(UUID tenant, boolean isBillingDepartment, Pageable pageable);

    Page<Department> findByTenantAndNameContainingIgnoreCaseAndBillingAllowed(
            UUID tenant, String departmentName, boolean isBillingDepartment, Pageable pageable);

    Page<Department> findByTenantAndWardIsTrue(UUID tenant, Pageable pageable);

    Page<Department> findByTenantAndNameContainingIgnoreCaseAndWardIsTrue(UUID tenant, String departmentName, Pageable pageable);

    List<Department> findByTenantAndNameIgnoreCase(UUID tenant, String name);

    List<Department> findByTenantAndCodeIgnoreCase(UUID tenant, String code);

    List<Department> findByTenantAndNameIgnoreCaseAndIdNot(UUID tenant, String name, Long departmentId);

    List<Department> findByTenantAndCodeIgnoreCaseAndIdNot(UUID tenant, String code, Long departmentId);
}
