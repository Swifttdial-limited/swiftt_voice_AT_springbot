package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.domains.Department;
import com.swifftdial.identityservice.repositories.DepartmentRepository;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.messaging.StreamChannels;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.MessageChannel;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DepartmentServiceImpl extends DepartmentService {

    private final DepartmentRepository departmentRepository;
//    private final MessageChannel newDepartmentCreatedChannel;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository,
                                 StreamChannels streamChannels) {
        super(departmentRepository, new Department());
        this.departmentRepository = departmentRepository;
//        this.newDepartmentCreatedChannel = streamChannels.newDepartmentCreated();
    }

    @Override
    public Department create(Department department) {
        if(!department.isBillingAllowed() && department.isMerchantDepartment())
            throw new BadRequestRestApiException()
                    .developerMessage("Merchant / Over-the-counter department must be a billing department")
                    .userMessage("Sorry. Merchant / Over-the-counter department must be a billing department");

        if(!departmentRepository.findByTenantAndNameIgnoreCase(department.getTenant(), department.getName()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate department exists")
                    .userMessage("Sorry. Duplicate department exists by name");

        if(department.getCode() != null &&
                !departmentRepository.findByTenantAndCodeIgnoreCase(department.getTenant(), department.getCode()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate department exists")
                    .userMessage("Sorry. Duplicate department exists by code");

        if (null != department.getParentDepartment())
            this.validate(department.getTenant(), department.getParentDepartment().getPublicId());

        Department newDepartment = super.create(department);

//        newDepartmentCreatedChannel.send(MessageBuilder.withPayload(newDepartment).build());

        return newDepartment;
    }

    @Override
    public List<Department> fetchAll() {
        return departmentRepository.findAll();
    }

    @Override
    public Page<Department> fetchDepartments(UUID tenant, Pageable pageable) {
        return departmentRepository.findByTenant(tenant, pageable);
    }

    @Override
    public Page<Department> fetchByParentDepartment(UUID tenant, UUID parentDepartmentPublicId, Pageable pageable) {
        return departmentRepository.findByTenantAndParentDepartmentPublicId(tenant, parentDepartmentPublicId, pageable);
    }

    @Override
    public Page<Department> fetchByName(UUID tenant, String name, Pageable pageable) {
        return departmentRepository.findByTenantAndNameContainingIgnoreCase(tenant, name, pageable);
    }

    @Override
    public Page<Department> fetchByIsBillingDepartment(UUID tenant, boolean isBillingDepartment, Pageable pageable) {
        return departmentRepository.findByTenantAndBillingAllowed(tenant, isBillingDepartment, pageable);
    }

    @Override
    public Page<Department> fetchByNameAndIsBillingDepartment(UUID tenant, String name, boolean isBillingDepartment, Pageable pageable) {
        return departmentRepository.findByTenantAndNameContainingIgnoreCaseAndBillingAllowed(tenant, name, isBillingDepartment, pageable);
    }

    @Override
    public Department update(UUID tenant, UUID departmentPublicId, Department department) {
        if(!department.isBillingAllowed() && department.isMerchantDepartment())
            throw new BadRequestRestApiException()
                    .developerMessage("Merchant / Over-the-counter department must be a billing department")
                    .userMessage("Sorry. Merchant / Over-the-counter department must be a billing department");

        if(!departmentRepository.findByTenantAndNameIgnoreCaseAndIdNot(
                tenant, department.getName(), department.getId()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate department exists")
                    .userMessage("Sorry. Duplicate department exists by name");

        if(department.getCode() != null &&
                !departmentRepository.findByTenantAndCodeIgnoreCaseAndIdNot(
                        tenant, department.getCode(), department.getId()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate department exists")
                    .userMessage("Sorry. Duplicate department exists by code");

        if (null != department.getParentDepartment())
            this.validate(tenant, department.getParentDepartment().getPublicId());

        return departmentRepository.save(department);
    }

    @Override
    public void delete(Department department) {
        Optional<Department> foundDepartment = departmentRepository
                .findByTenantAndPublicId(department.getTenant(), department.getPublicId());

        if(foundDepartment.isPresent()) {
            foundDepartment.get().setDeleted(true);
            foundDepartment.get().setDeleteDate(new Date());
            departmentRepository.save(foundDepartment.get());
        }
    }

    @Override
    public Page<Department> getWards(UUID tenant, Pageable pageable) {
        return departmentRepository.findByTenantAndWardIsTrue(tenant, pageable);
    }

    @Override
    public Page<Department> fetchWardByName(UUID tenant, String departmentName, Pageable pageable) {
        return departmentRepository.findByTenantAndNameContainingIgnoreCaseAndWardIsTrue(tenant, departmentName, pageable);
    }

}
