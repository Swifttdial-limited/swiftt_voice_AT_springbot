package com.swifttdial.atservice.domains.dto.cdr;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
public class AppLog {
    private List<Application> application = new ArrayList<>();
}