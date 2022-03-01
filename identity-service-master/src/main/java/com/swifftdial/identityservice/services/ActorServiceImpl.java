package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.datatypes.Status;
import com.swifftdial.identityservice.repositories.ActorRepository;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifftdial.identityservice.domains.Actor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Created by daniel.gathigai on 13/09/2016.
 */
@Service
public class ActorServiceImpl implements ActorService {

    private final ActorRepository actorRepository;
    private final RoleService roleService;

    @Autowired
    public ActorServiceImpl(ActorRepository actorRepository, RoleService roleService) {
        this.actorRepository = actorRepository;
        this.roleService = roleService;
    }

    @Override
    public Actor createActor(Actor newActor) {
        if(!actorRepository.findByTenantAndNameIgnoreCase(newActor.getTenant(), newActor.getName()).isEmpty()) {
            throw new BadRequestRestApiException()
                    .developerMessage("Duplicate record found")
                    .userMessage("Sorry. Duplicate record exists");
        }


        return actorRepository.save(newActor);
    }

    @Override
    public Page<Actor> fetchSortedActors(UUID tenant, Pageable pageable) {
        return actorRepository.findByTenant(tenant, pageable);
    }

    @Override
    @Cacheable(cacheNames = "actors")
    public Actor fetchActorByPublicId(UUID tenant, UUID actorPublicId) {
        return actorRepository.findByTenantAndPublicId(tenant, actorPublicId)
                .orElseThrow(() ->
                        new ResourceNotFoundRestApiException()
                                .developerMessage("Actor not found")
                                .userMessage("Sorry. Actor not found"));
    }

    @Override
    public Actor updateActor(UUID tenant, UUID actorPublicId, Actor updatedActor) {
        this.validate(tenant, actorPublicId);

        if(actorRepository.findByTenantAndNameIgnoreCaseAndIdNot(
                tenant, updatedActor.getName(), updatedActor.getId()).isPresent())
        throw new BadRequestRestApiException()
                .developerMessage("Duplicate record found")
                .userMessage("Sorry. Duplicate record exists");

        return actorRepository.save(updatedActor);
    }

    @Override
    @CacheEvict(cacheNames = "actors")
    public void deleteActor(UUID tenant, Actor actor) {
        if(!roleService.findByActor(tenant, actor).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Actor / User group in role definition")
                    .userMessage("Sorry. User group already used in role definition");

        actor.setDeleted(true);
        actorRepository.save(actor);
    }

    @Cacheable(cacheNames = "actorsCount")
    @Override
    public Long countActors() {
        return actorRepository.count();
    }

    @Override
    public Actor changeStatus(UUID tenant, Status status, UUID actorPublicId) {
        Actor actor = this.validate(tenant, actorPublicId);
        if (!actor.getStatus().equals(status)) {
            actor.setStatus(status);
            actorRepository.save(actor);
        }
        return actor;
    }

    public Actor validate(UUID tenant, UUID actorPubicId) {
        return this.actorRepository.findByTenantAndPublicId(tenant, actorPubicId)
                .orElseThrow(() -> new ResourceNotFoundRestApiException()
                        .userMessage("Sorry. The actor does not exist")
                        .developerMessage("The actor does not exist"));
    }

    @Override
    public List<Actor> findByActorName(UUID tenant, String actorName) {
        return actorRepository.findByTenantAndNameIgnoreCase(tenant, actorName);
    }

    @Override
    public Page<Actor> searchByActorName(UUID tenant, String actorName, Pageable pageable) {
        return actorRepository.findByTenantAndNameContainingIgnoreCase(tenant, actorName, pageable);
    }
}