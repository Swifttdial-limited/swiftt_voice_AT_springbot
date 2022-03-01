package com.swifttdial.licenceservice.repositories;

import com.swifttdial.licenceservice.domains.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpecializationRepository extends JpaRepository<Specialization, Long> {
}
