package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.Privilege;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrivilegeRepository extends JpaRepository<Privilege, Long> {
    Optional<Privilege> findByCode(@Param("code") String code);

    List<Privilege> findByGlobalIsTrue();

    Page<Privilege> findByGlobalIsTrue(Pageable pageable);
}
