package com.example.fintrack.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.ZonedDateTime;

public record AddEventDto(
        @NotBlank
        String name,
        @NotNull
        Long currencyId,
        @NotNull
        ZonedDateTime startDate,
        ZonedDateTime endDate
) {
}
