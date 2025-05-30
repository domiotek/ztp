package com.example.fintrack.category.limit;

import com.example.fintrack.category.Category;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Table(name = "limits")
public class Limit {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private ZonedDateTime startDateTime;

    private ZonedDateTime endDateTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Limit limit)) return false;
        return Objects.equals(id, limit.id) && Objects.equals(category, limit.category) &&
                Objects.equals(amount, limit.amount) && Objects.equals(startDateTime, limit.startDateTime) &&
                Objects.equals(endDateTime, limit.endDateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, category, amount, startDateTime, endDateTime);
    }
}
