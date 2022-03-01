package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.domains.NextOfKin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface NextOfKinService {

    NextOfKin createNextOfKin(NextOfKin nextOfKin);

    Page<NextOfKin> fetchByUserPublicId(UUID userPublicId, Pageable pageable);

    NextOfKin update(UUID publicId, NextOfKin nextOfKin);

    void delete(UUID publicId);

}