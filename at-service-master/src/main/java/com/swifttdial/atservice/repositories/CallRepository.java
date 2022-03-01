package com.swifttdial.atservice.repositories;

import com.swifttdial.atservice.datatypes.CallDirection;
import com.swifttdial.atservice.datatypes.CallSessionState;
import com.swifttdial.atservice.datatypes.CallStatus;
import com.swifttdial.atservice.domains.Call;
import com.swifttdial.atservice.domains.custom.CallByAgent;
import com.swifttdial.atservice.domains.custom.CallCountByDirection;
import com.swifttdial.atservice.domains.custom.CallCountBySessionState;
import com.swifttdial.atservice.domains.custom.CallCountByStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CallRepository extends JpaRepository<Call, Long> {

    Optional<Call> findByPublicId(UUID publicId);

    Optional<Call> findBySessionId(String sessionId);

    Page<Call> findAllByTenant(UUID tenant, Pageable pageable);

    Page<Call> findAllByStatus(CallStatus status, Pageable pageable);

    Page<Call> findAllByDirection(CallDirection direction, Pageable pageable);

    Page<Call> findAllByCallSessionState(CallSessionState callSessionState, Pageable pageable);

    @Query("SELECT c.status as status, COUNT(c.status) as total FROM Call as c WHERE c.tenant = ?1 GROUP BY c.status")
    List<CallCountByStatus> countTotalCallsByStatus(UUID tenant);

    @Query("SELECT c.direction as direction, COUNT(c.direction) as total FROM Call as c WHERE c.tenant = ?1 GROUP BY c.direction")
    List<CallCountByDirection> countTotalCallsByDirection(UUID tenant);

    @Query("SELECT c.callSessionState as sessionState, COUNT(c.callSessionState) as total FROM Call as c WHERE c.tenant = ?1 GROUP BY c.callSessionState")
    List<CallCountBySessionState> countTotalCallsBySessionState(UUID tenant);

    @Query(value="select users.user_firstname as agent, count(*) as total from calls.calls inner join systemusers.agents on calls.dial_destination_number = agents.agent_phone_number inner join systemusers.users on users.user_id=agents.agent_user_id where calls.tenant=?1 group by users.user_firstname",
            nativeQuery=true)
    List<CallByAgent> fetchCallsByAgent(UUID tenant);

    Page<Call> findByTenantAndStatus(UUID tenant, CallStatus status, Pageable pageable);

    Page<Call> findByTenantAndCreatedDateBefore(UUID tenant, Date startDate, Pageable pageable);

    Page<Call> findByTenantAndCreatedDateAfter(UUID tenant, Date endDate, Pageable pageable);

    Page<Call> findByTenantAndCreatedDateBetween(UUID tenant, Date startDate, Date endDate, Pageable pageable);

    Page<Call> findByTenantAndCreatedDate(UUID tenant, Date creationDate, Pageable pageable);
}
