package com.swifftdial.identityservice.utils.converters;

import com.swifftdial.identityservice.domains.dto.SystemUser;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LoggedInUserDetailsToUserConverter implements Converter<LoggedInUserDetails, SystemUser> {

    @Override
    public SystemUser convert(LoggedInUserDetails source) {
        return new SystemUser(source.getFullName(), source.getUsername(), source.getPublicId());
    }

}
