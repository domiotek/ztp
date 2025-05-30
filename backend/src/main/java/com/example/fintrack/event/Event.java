package com.example.fintrack.event;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.userevent.UserEvent;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class Event {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @OneToMany(mappedBy = "event")
    @ToString.Exclude
    private Set<UserEvent> users;

    @OneToMany(mappedBy = "event")
    @ToString.Exclude
    private Set<Bill> bills;    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private ZonedDateTime startDateTime;

    private ZonedDateTime endDateTime;

    public EventStatus getEventStatus() {
        ZonedDateTime now = ZonedDateTime.now();

        if (now.isBefore(startDateTime)) {
            return EventStatus.UPCOMING;
        } else if (endDateTime == null || now.isBefore(endDateTime)) {
            return EventStatus.ONGOING;
        } else {
            return EventStatus.FINISHED;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Event event)) return false;
        return Objects.equals(id, event.id) && Objects.equals(currency, event.currency) &&
                Objects.equals(name, event.name) && Objects.equals(startDateTime, event.startDateTime) &&
                Objects.equals(endDateTime, event.endDateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, currency, name, startDateTime, endDateTime);
    }
}
