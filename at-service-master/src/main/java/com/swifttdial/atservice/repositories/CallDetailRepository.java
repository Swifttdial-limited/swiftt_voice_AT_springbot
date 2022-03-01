package com.swifttdial.atservice.repositories;

import com.swifttdial.atservice.domains.Call;
import com.swifttdial.atservice.domains.CallDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CallDetailRepository extends JpaRepository<CallDetail, Long> {

    Optional<CallDetail> findByPublicId(UUID publicId);
    List<CallDetail> findAllByCall(Call call);
    Page<CallDetail> findAllByCall_PublicId(UUID callPublicId, Pageable pageable);
}
