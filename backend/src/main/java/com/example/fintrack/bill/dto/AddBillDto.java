package com.example.fintrack.bill.dto;

import com.example.fintrack.category.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Builder
public record AddBillDto(
   @NotBlank
   String name,
   @NotNull
   BigDecimal amount,
   @NotNull
   Long categoryId,
   @NotNull
   Long currencyId,
   @NotNull
   ZonedDateTime date,
   Long eventId,
   Long paidBy,
   Long userId
) {
}
