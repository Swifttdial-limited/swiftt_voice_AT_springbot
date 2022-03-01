package com.swifttdial.licenceservice.domains.dto;

import com.swifttdial.licenceservice.datatypes.LicenseType;
import com.swifttdial.licenceservice.domains.Institution;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LicenseDTO {
    private Institution institution;
    private LicenseType licenseType;
}
