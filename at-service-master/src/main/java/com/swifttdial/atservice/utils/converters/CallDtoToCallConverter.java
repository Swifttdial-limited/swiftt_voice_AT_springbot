package com.swifttdial.atservice.utils.converters;

import com.swifttdial.atservice.domains.Call;
import com.swifttdial.atservice.domains.dto.CallDto;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class CallDtoToCallConverter implements Converter<CallDto, Call> {
    @Override
    public Call convert(CallDto source) {
        Call call = new Call();
        call.setAmount(source.getAmount());
        call.setCallerCarrierName(source.getCallerCarrierName());
        call.setCallerCountryCode(source.getCallerCountryCode());
        call.setCallerNumber(source.getCallerNumber());
        call.setCallSessionState(source.getCallSessionState());
        call.setCallStartTime(source.getCallStartTime());
        call.setCurrencyCode(source.getCurrencyCode());
        call.setDestinationNumber(source.getDestinationNumber());
        call.setDialDestinationNumber(source.getDialDestinationNumber());
        call.setDialDurationInSeconds(source.getDialDurationInSeconds());
        call.setDialStartTime(source.getDialStartTime());
        call.setDirection(source.getDirection());
        call.setDtmfDigits(source.getDtmfDigits());
        call.setDurationInSeconds(source.getDurationInSeconds());
        call.setIsActive(source.getIsActive());
        call.setRecordingUrl(source.getRecordingUrl());
        call.setSessionId(source.getSessionId());
        return call;
    }
}
