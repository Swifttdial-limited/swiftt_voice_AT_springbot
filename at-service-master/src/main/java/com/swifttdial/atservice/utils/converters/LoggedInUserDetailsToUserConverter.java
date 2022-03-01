package com.swifttdial.atservice.utils.converters;

import com.swifttdial.atservice.domains.dto.LoggedInUserDetails;
import com.swifttdial.atservice.domains.dto.SystemUser;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LoggedInUserDetailsToUserConverter implements Converter<LoggedInUserDetails, SystemUser> {

    @Override
    public SystemUser convert(LoggedInUserDetails source) {
        return new SystemUser(source.getFullName(), source.getUsername(), source.getPublicId());
    }

}
