package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.domains.BaseEntity;
import com.swifftdial.identityservice.repositories.GenericJpaRepository;
import com.swifftdial.identityservice.utils.exceptions.ResourceNotFoundRestApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public abstract class CRUDAbstractService<T extends BaseEntity, R extends GenericJpaRepository<T, Long>> {

    private T t;

    private R r;

    public CRUDAbstractService(T t, R r) {
        this.t = t;
        this.r = r;
    }

    public T create(T t) {
        return r.save(t);
    }

    public T fetchByPublicId(UUID publicId) {
        return validate(publicId);
    }

    public T fetchByPublicId(UUID tenant, UUID publicId) {
        return validate(tenant, publicId);
    }

    public Page<T> fetchAll(Pageable pageable) {
        return r.findAll(pageable);
    }

    public List<T> fetchAll(UUID tenant) {
        return r.findByTenant(tenant);
    }

    public Page<T> fetchAll(UUID tenant, Pageable pageable) {
        return r.findByTenant(tenant, pageable);
    }

    public T update(UUID tenant, UUID publicId, T t) {
        validate(tenant, publicId);
        return r.save(t);
    }

    public T validate(UUID publicId) {
        return r.findByPublicId(publicId).orElseThrow(
                () -> new ResourceNotFoundRestApiException()
                        .userMessage("Sorry. " + t.getClass().getSimpleName() + " not found.")
                        .developerMessage(t.getClass().getSimpleName() + " not found."));
    }

    public T validate(UUID tenant, UUID publicId) {
        return r.findByTenantAndPublicId(tenant, publicId).orElseThrow(
                () -> new ResourceNotFoundRestApiException()
                        .userMessage("Sorry. " + t.getClass().getSimpleName() + " not found.")
                        .developerMessage(t.getClass().getSimpleName() + " not found."));
    }

    public void delete(UUID tenant, UUID publicId) {
        r.findByTenantAndPublicId(tenant, publicId).ifPresent(t -> {
            t.setDeleted(true);
            t.setDeleteDate(new Date());
            r.save(t);
        });
    }



}
