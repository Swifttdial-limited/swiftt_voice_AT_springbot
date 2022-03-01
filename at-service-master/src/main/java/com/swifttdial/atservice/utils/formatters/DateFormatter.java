package com.swifttdial.atservice.utils.formatters;

import com.swifttdial.atservice.utils.exceptions.InternalServerErrorRestApiException;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

public class DateFormatter {
    public static LocalDateTime convertDate(String dateString) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        Date startDate;
        try {
            startDate = df.parse(dateString);
            System.out.print(LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault()).toString());
            return LocalDateTime.ofInstant(startDate.toInstant(), ZoneId.systemDefault());
        } catch (ParseException e) {
            throw new InternalServerErrorRestApiException().userMessage("Invalid date format").developerMessage("Invalid date format");
        }

    }

    public static Date covertToJavaDate(String stringDate) throws ParseException {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        return df.parse(stringDate);
    }

    public static String convertToString(Date date) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        return df.format(date);
    }

    public static Date getMaxDateTime(String dateString) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        Calendar cal = Calendar.getInstance();
        try {
            cal.setTime(df.parse(dateString));
            cal.set(Calendar.HOUR_OF_DAY, 23);
            cal.set(Calendar.MINUTE, 59);
            cal.set(Calendar.SECOND, 59);
            return cal.getTime();
        } catch (ParseException e) {
            throw new InternalServerErrorRestApiException().userMessage("Invalid date format");
        }
    }

    public static Date getMinDateTime(String dateString) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        Calendar cal = Calendar.getInstance();
        try {
            cal.setTime(df.parse(dateString));
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            return cal.getTime();
        } catch (ParseException e) {
            throw new InternalServerErrorRestApiException().userMessage("Invalid date format");
        }
    }

    public static Date getMinDate(String dateString) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return df.parse(dateString);
        } catch (ParseException e) {
            throw new InternalServerErrorRestApiException().userMessage("Invalid date format");
        }
    }

    public static Date getMaxDate(String dateString) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return df.parse(dateString);
        } catch (ParseException e) {
            throw new InternalServerErrorRestApiException().userMessage("Invalid date format");
        }
    }
}
