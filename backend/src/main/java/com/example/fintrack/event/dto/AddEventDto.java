package com.example.fintrack.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.ZonedDateTime;
import java.util.List;

public record AddEventDto(
        @NotBlank
        String name,
        @NotNull
        Long currencyId,
        @NotNull
        ZonedDateTime startDate,
        ZonedDateTime endDate,
        @NotNull
        List<Long> usersIds
) {
}
