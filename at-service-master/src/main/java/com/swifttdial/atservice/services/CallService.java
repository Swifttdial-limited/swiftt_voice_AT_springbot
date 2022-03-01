package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.Call;
import com.swifttdial.atservice.domains.dto.CallDto;
import com.swifttdial.atservice.domains.dto.CallCountTotalDto;
import com.swifttdial.atservice.domains.dto.MakeCallDTO;
import com.swifttdial.atservice.domains.dto.cdr.Cdr;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.net.MalformedURLException;
import java.util.UUID;

public interface CallService {
    Call fetchByPublicId(UUID publicId);
    Page<Call> fetchSorted(Pageable pageable);
    Page<Call> fetchSortedTenantCalls(UUID tenant, String startDate, String endDate, String date, Pageable pageable);
    Call update(UUID publicId, Call ivr);
    void delete(UUID publicId);
    void makeCall(MakeCallDTO makeCallDTO);
    String handleCall(CallDto callDto, UUID institutionPublicId, int level) throws MalformedURLException;
    CallCountTotalDto callCountTotals(UUID tenant);
    void handleCallCdr(Cdr cdr);
}
