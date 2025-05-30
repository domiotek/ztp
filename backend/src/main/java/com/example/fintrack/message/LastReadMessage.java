package com.example.fintrack.message;

import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.ZonedDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Table(name="last_read_message")
public class LastReadMessage {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private ZonedDateTime readTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LastReadMessage that = (LastReadMessage) o;
        return Objects.equals(id, that.id) && Objects.equals(message, that.message) && Objects.equals(user, that.user) && Objects.equals(readTime, that.readTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, message, user, readTime);
    }
}
