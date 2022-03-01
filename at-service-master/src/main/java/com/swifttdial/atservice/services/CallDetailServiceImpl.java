package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.CallDetail;
import com.swifttdial.atservice.repositories.CallDetailRepository;
import com.swifttdial.atservice.utils.exceptions.BadRequestRestApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
public class CallDetailServiceImpl implements CallDetailService {

    private final CallDetailRepository callDetailRepository;

    public CallDetailServiceImpl(CallDetailRepository callDetailRepository) {
        this.callDetailRepository = callDetailRepository;
    }

    @Override
    public CallDetail createCallDetail(CallDetail callDetail) {
        return callDetailRepository.save(callDetail);
    }

    @Override
    public CallDetail findByPublicId(UUID publicId) {
        return validate(publicId);
    }

    @Override
    public Page<CallDetail> findSortedByCall(UUID callPublicId, Pageable pageable) {
        return callDetailRepository.findAllByCall_PublicId(callPublicId, pageable);
    }

    @Override
    public CallDetail updateCallDetail(UUID publicId, CallDetail callDetail) {
        CallDetail callDetail1 = validate(publicId);
        if (!Objects.equals(callDetail.getId(), callDetail1.getId()) ){
            throw new BadRequestRestApiException()
                    .developerMessage("The details do not match.")
                    .userMessage("Sorry. The details do not match.");
        }
        return callDetailRepository.save(callDetail);
    }

    @Override
    public void deleteCallDetail(UUID publicId) {
        callDetailRepository.findByPublicId(publicId)
                .ifPresent(callDetail -> {
                    callDetail.setDeleted(true);
                    callDetailRepository.save(callDetail);
                });
    }

    private CallDetail validate(UUID publicId){
        return callDetailRepository.findByPublicId(publicId)
                .orElseThrow(() ->
                        new BadRequestRestApiException()
                .developerMessage("Sorry, the call details were not found")
                .userMessage("Sorry, the call details were not found"));
    }
}
