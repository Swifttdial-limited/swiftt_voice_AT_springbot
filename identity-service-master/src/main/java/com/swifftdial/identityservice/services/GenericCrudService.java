package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.repositories.GenericJpaRepository;
import com.swifftdial.identityservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifftdial.identityservice.domains.BaseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public abstract class GenericCrudService<T extends BaseEntity, R extends GenericJpaRepository<T, Long>> {

    private T t;

    private R r;

    public GenericCrudService(T t, R r) {
        this.t = t;
        this.r = r;
    }

    public T create(T t) {
        return r.save(t);
    }

    public Page<T> fetchAll(UUID tenant, Pageable pageable) {
        return r.findByTenant(tenant, pageable);
    }

    public T update(UUID tenant, UUID publicId, T t) {
        validate(tenant, publicId);
        return r.save(t);
    }

    public T validate(UUID tenant, UUID publicId) {
        return r.findByTenantAndPublicId(tenant, publicId).orElseThrow(
                () -> new ResourceNotFoundRestApiException()
                        .userMessage("Sorry. " + t.getClass().getSimpleName() + " not found.")
                        .developerMessage(t.getClass().getSimpleName() + " not found."));
    }

    public T validate(long id) {
        return r.findById(id).orElseThrow(
                () -> new ResourceNotFoundRestApiException()
                        .userMessage("Sorry. " + t.getClass().getSimpleName() + " not found.")
                        .developerMessage(t.getClass().getSimpleName() + " not found."));
    }

    public void delete(UUID tenant, UUID publicId) {
        r.findByTenantAndPublicId(tenant, publicId).ifPresent(t -> {
            t.setDeleted(true);
            r.save(t);
        });
    }

}
