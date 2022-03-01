package com.swifttdial.licenceservice.services;

import com.swifttdial.licenceservice.domains.Institution;
import com.swifttdial.licenceservice.domains.Licence;

public interface LicenseService {
    Licence createLicense(Institution institution, Licence license);
}
