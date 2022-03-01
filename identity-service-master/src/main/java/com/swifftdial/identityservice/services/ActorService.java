package com.swifftdial.identityservice.services;


import com.swifftdial.identityservice.datatypes.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

import com.swifftdial.identityservice.domains.Actor;

/**
 * Created by daniel.gathigai on 13/09/2016.
 */
public interface ActorService {

    Actor createActor(Actor newActor);

    Page<Actor> fetchSortedActors(UUID tenant, Pageable pageable);

    Actor fetchActorByPublicId(UUID tenant, UUID actorPublicId);

    Actor updateActor(UUID tenant, UUID actorPublicId, Actor updatedActor);

    void deleteActor(UUID tenant, Actor actor);

    Long countActors();

    Actor changeStatus(UUID tenant, Status status, UUID actor);

    Actor validate(UUID tenant, UUID actorPublicId);

    List<Actor> findByActorName(UUID tenant, String actorName);

    Page<Actor> searchByActorName(UUID tenant, String actorName, Pageable pageable);
}