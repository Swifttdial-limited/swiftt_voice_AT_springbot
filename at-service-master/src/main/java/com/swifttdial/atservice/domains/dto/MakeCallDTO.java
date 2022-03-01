package com.swifttdial.atservice.domains.dto;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MakeCallDTO {
    private String to;
    private String from;
}
