package com.example.fintrack.bill.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record AddBillEventDto(
        String name,
        ZonedDateTime date,
        BigDecimal amount,
        Long categoryId,
        Long paidById
) {
}
