package com.example.fintrack.currency;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.event.Event;
import com.example.fintrack.rate.Rate;
import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Currency {

    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "currency")
    @ToString.Exclude
    private Set<Rate> rates;

    @OneToMany(mappedBy = "currency")
    @ToString.Exclude
    private Set<User> users;

    @OneToMany(mappedBy = "currency")
    @ToString.Exclude
    private Set<Bill> bills;

    @OneToMany(mappedBy = "currency")
    @ToString.Exclude
    private Set<Event> events;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Currency currency)) return false;
        return Objects.equals(id, currency.id) && Objects.equals(name, currency.name)
                && Objects.equals(code, currency.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, code);
    }
}
