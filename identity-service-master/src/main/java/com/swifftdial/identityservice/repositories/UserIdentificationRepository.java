package com.swifftdial.identityservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.swifftdial.identityservice.domains.UserIdentification;

@Repository
public interface UserIdentificationRepository extends JpaRepository<UserIdentification, Long> {

}
