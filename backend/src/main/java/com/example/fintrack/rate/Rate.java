package com.example.fintrack.rate;

import com.example.fintrack.currency.Currency;
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
public class Rate {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @Column(nullable = false)
    private ZonedDateTime date;

    @Column(nullable = false)
    private BigDecimal amount;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Rate rate)) return false;
        return Objects.equals(id, rate.id) && Objects.equals(currency, rate.currency) &&
                Objects.equals(date, rate.date) && Objects.equals(amount, rate.amount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, currency, date, amount);
    }
}
