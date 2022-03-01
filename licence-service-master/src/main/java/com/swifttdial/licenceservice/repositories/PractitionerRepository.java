package com.swifttdial.licenceservice.repositories;

import com.swifttdial.licenceservice.domains.Practitioner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PractitionerRepository extends JpaRepository<Practitioner, Long> {
}
