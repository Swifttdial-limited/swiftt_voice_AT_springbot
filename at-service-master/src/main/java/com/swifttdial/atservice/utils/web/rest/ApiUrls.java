package com.swifttdial.atservice.utils.web.rest;

import com.swifttdial.atservice.utils.web.UrlSpace;

/**
 * Created by daniel.olanga on 11/22/2015.
 */
public class ApiUrls implements UrlSpace {

    public static final String ME = "/me";

    public static final String ORGANIZATION_UNITS = "/organizationunits";
    public static final String ORGANIZATION_UNIT = "/organizationunits/{organizationUnitId}";
    public static final String ORGANIZATION_UNIT_BRANCHES = "/organizationunits/{organizationUnitId}/branches";

    public static final String ORGANIZATION_UNIT_BRANCH = "/organizationunitbranches/{organizationUnitBranchId}";

    public static final String USERS = "/users";
    public static final String USER = "/users/{userId}";
}