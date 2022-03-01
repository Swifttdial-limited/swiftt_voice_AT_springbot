package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.domains.Department;
import com.swifftdial.identityservice.repositories.DepartmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public abstract class DepartmentService extends CRUDAbstractService<Department, DepartmentRepository> {

    public DepartmentService(DepartmentRepository departmentRepository, Department department) {
        super(department, departmentRepository);
    }

    public abstract List<Department> fetchAll();

    public abstract Page<Department> fetchDepartments(UUID tenant, Pageable pageable);

    public abstract Page<Department> fetchByParentDepartment(UUID tenant, UUID parentDepartmentPublicId, Pageable pageable);

    public abstract Page<Department> fetchByName(UUID tenant, String name, Pageable pageable);

    public abstract Page<Department> fetchByIsBillingDepartment(UUID tenant, boolean isBillingDepartment, Pageable pageable);

    public abstract Page<Department> fetchByNameAndIsBillingDepartment(UUID tenant, String name, boolean isBillingDepartment, Pageable pageable);

    public abstract Page<Department> getWards(UUID tenant, Pageable pageable);

    public abstract Page<Department> fetchWardByName(UUID tenant, String departmentName, Pageable pageable);

    public abstract Department update(UUID tenant, UUID departmentPublicId, Department department);

    public abstract void delete(Department department);
}
