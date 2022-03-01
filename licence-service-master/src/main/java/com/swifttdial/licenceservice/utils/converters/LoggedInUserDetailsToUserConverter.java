package com.swifttdial.licenceservice.utils.converters;

import com.swifttdial.licenceservice.domains.dto.LoggedInUserDetails;
import com.swifttdial.licenceservice.domains.dto.SystemUser;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LoggedInUserDetailsToUserConverter implements Converter<LoggedInUserDetails, SystemUser> {

    @Override
    public SystemUser convert(LoggedInUserDetails source) {
        return new SystemUser(source.getFullName(), source.getUsername(), source.getPublicId());
    }

}
