package com.swifttdial.atservice.repositories;

import com.swifttdial.atservice.domains.Ivr;
import com.swifttdial.atservice.domains.IvrOption;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IvrOptionRepository extends JpaRepository<IvrOption, Long> {

    Optional<IvrOption> findByPublicId(UUID publicId);

    Page<IvrOption> findByTenant(UUID tenant, Pageable pageable);

    List<IvrOption> findByIvrAndLevel(Ivr ivr, int level);

    List<IvrOption> findByParent(IvrOption parent);
}
