package com.swifttdial.licenceservice.domains.dto;

import com.swifttdial.licenceservice.datatypes.InstitutionType;
import com.swifttdial.licenceservice.domains.Institution;
import com.swifttdial.licenceservice.domains.vo.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class InstitutionDTO implements Serializable {

    private Institution institution;
    private InstitutionType institutionType;
    private User user;
}
