package com.swifttdial.atservice.utils.converters;

import com.swifttdial.atservice.domains.CallDetail;
import com.swifttdial.atservice.domains.dto.CallDto;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class CallDtoToCallDetailConverter implements Converter<CallDto, CallDetail> {
    @Override
    public CallDetail convert(CallDto source) {
        CallDetail callDetail = new CallDetail();
        callDetail.setCallSessionState(source.getCallSessionState());
        callDetail.setDtmfDigits(source.getDtmfDigits());
        callDetail.setIsActive(source.getIsActive());
        return callDetail;
    }
}
