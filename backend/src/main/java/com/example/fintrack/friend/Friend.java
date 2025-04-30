package com.example.fintrack.friend;

import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Table(name = "friends")
public class Friend {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne
    @JoinColumn(name="user_friend_id", nullable=false)
    private Friend friend;

    @Column(nullable = false)
    private boolean isAccepted = false;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Friend friend1 = (Friend) o;
        return isAccepted == friend1.isAccepted && Objects.equals(id, friend1.id) && Objects.equals(user, friend1.user) && Objects.equals(friend, friend1.friend);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, friend, isAccepted);
    }
}
