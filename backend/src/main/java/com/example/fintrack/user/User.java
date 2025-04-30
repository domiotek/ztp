package com.example.fintrack.user;

import com.example.fintrack.chat.UserChatConnection;
import com.example.fintrack.event.Event;
import com.example.fintrack.message.LastReadMessage;
import com.example.fintrack.order.Order;
import com.example.fintrack.payment.Payment;
import com.example.fintrack.category.Category;
import com.example.fintrack.currency.Currency;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private Set<Category> categories;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private Set<Payment> payments;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    private Set<Order> orders;

    @OneToMany(mappedBy =  "user")
    @ToString.Exclude
    Set<UserChatConnection> chats;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    Set<LastReadMessage> lastReadMessages;

    @ManyToMany
    @ToString.Exclude
    private Set<Event> events;

    @ManyToMany
    @JoinTable(
            name="friends",
            joinColumns=@JoinColumn(name="user_id"),
            inverseJoinColumns=@JoinColumn(name="user_friend_id")
    )
    @ToString.Exclude
    private Set<User> friends;

    @ManyToMany
    @JoinTable(
            name="friends",
            joinColumns=@JoinColumn(name="user_friend_id"),
            inverseJoinColumns=@JoinColumn(name="user_id")
    )
    @ToString.Exclude
    private Set<User> friendOf;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User user)) return false;
        return Objects.equals(id, user.id) && Objects.equals(currency, user.currency) &&
                Objects.equals(payments, user.payments) && Objects.equals(firstName, user.firstName) &&
                Objects.equals(lastName, user.lastName) && Objects.equals(email, user.email) &&
                Objects.equals(password, user.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, currency, payments, firstName, lastName, email, password);
    }
}
