package com.example.fintrack.category;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.category.limit.Limit;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.ZonedDateTime;

public class CategorySpecification {

    public static Specification<Category> hasUserId(long userId) {
        return (root, query, builder) ->  builder.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Category> hasCategoryName(String categoryName) {
        return (root, query, builder) ->  builder.like(builder.lower(root.get("name")), "%" + categoryName.toLowerCase() + "%");
    }

    public static Specification<Category> hasCategoryBillsBetween(ZonedDateTime from, ZonedDateTime to) {
        return (root, query, builder) ->  {
            Join<Category, Bill> billJoin = root.join("bills", JoinType.INNER);
            return builder.between(billJoin.get("date"), from, to);
        };
    }

    public static Specification<Category> hasCategoryLimitsAfter(ZonedDateTime from) {
        return (root, query, builder) ->  {
            Join<Category, Limit> limitJoin = root.join("limits", JoinType.INNER);
            return builder.greaterThan(limitJoin.get("startDateTime"), from);
        };
    }

    public static Specification<Category> hasCategoryLimitsBefore(ZonedDateTime to) {
        return (root, query, builder) ->  {
            Join<Category, Limit> limitJoin = root.join("limits", JoinType.INNER);
            return builder.lessThan(limitJoin.get("endDateTime"), to);
        };
    }
}
