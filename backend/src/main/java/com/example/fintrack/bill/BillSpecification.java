package com.example.fintrack.bill;

import org.springframework.data.jpa.domain.Specification;

import java.time.ZonedDateTime;

public class BillSpecification {

    public static Specification<Bill> hasUserId(long userId) {
        return (root, query, builder) ->  builder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Bill> hasPaidById(long paidId) {
        return (root, query, builder) -> builder.equal(root.get("paidBy").get("id"), paidId);
    }

    public static Specification<Bill> hasBillsBetweenDates(ZonedDateTime from, ZonedDateTime to) {
        return (root, query, builder) -> builder.between(root.get("date"), from, to);
    }

    public static Specification<Bill> hasCategoryId(Long categoryId) {
        return (root, query, builder) -> builder.equal(root.get("category").get("id"), categoryId);
    }
}
