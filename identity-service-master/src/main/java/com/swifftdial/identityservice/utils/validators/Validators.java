package com.swifftdial.identityservice.utils.validators;

import java.util.Arrays;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Created by Elphas Khajira on 1/11/17.
 */
public class Validators {
    public static boolean allEqualNull(Object... objs) {
        for (Object o : objs) {
            if (o != null) {
                return false;
            }
        }
        return true;
    }

    public static boolean allNotEqualNull(Object... objs) {
        for (Object o : objs) {
            if (o == null) {
                return false;
            }
        }
        return true;
    }

    public static boolean someNotEqualNull(Object... objects) {
        return !Arrays.stream(objects).filter(Objects::nonNull).collect(Collectors.toList()).isEmpty();
    }
}
