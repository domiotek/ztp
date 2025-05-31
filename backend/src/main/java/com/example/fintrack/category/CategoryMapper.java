package com.example.fintrack.category;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.category.dto.CategoryDto;
import com.example.fintrack.category.limit.LimitMapper;

import java.math.BigDecimal;

public class CategoryMapper {

    public static CategoryDto categoryToCategoryDto(Category category) {

        return CategoryDto.builder()
                .name(category.getName())
                .color(category.getColor())
                .limitDto(category.getLimits().stream().map(LimitMapper::limitToLimitDto).toList())
                .userCosts(calculateCosts(category))
                .build();
    }

    private static double calculateCosts(Category category) {
        return category.getBills()
                .stream()
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();
    }
}
