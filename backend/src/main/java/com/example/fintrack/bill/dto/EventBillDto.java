package com.example.fintrack.bill.dto;

import com.example.fintrack.event.dto.EventBillCurrencyDto;
import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record EventBillDto(
        Long id,
        String name,
        ZonedDateTime date,
        EventBillUserDto paidBy,
        EventBillCurrencyDto eventCurrency,
        EventBillCurrencyDto userCurrency
) {
}
