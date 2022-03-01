package com.swifftdial.identityservice.domains.dto;

import com.swifftdial.identityservice.datatypes.InstitutionType;
import com.swifftdial.identityservice.domains.User;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionDTO {

    private Institution institution;
    private InstitutionType institutionType = InstitutionType.CLIENT;
    private User user;
}
