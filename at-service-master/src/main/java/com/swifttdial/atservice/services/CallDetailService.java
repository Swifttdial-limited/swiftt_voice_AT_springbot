package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.CallDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CallDetailService {

    CallDetail createCallDetail(CallDetail callDetail);
    CallDetail findByPublicId(UUID publicId);
    Page<CallDetail> findSortedByCall(UUID callPublicId, Pageable pageable);
    CallDetail updateCallDetail(UUID publicId, CallDetail callDetail);
    void deleteCallDetail(UUID publicId);
}
