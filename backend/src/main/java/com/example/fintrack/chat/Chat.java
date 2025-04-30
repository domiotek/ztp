package com.example.fintrack.chat;

import com.example.fintrack.message.Message;
import com.example.fintrack.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Table(name="chats")
public class Chat {
    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "chat")
    @ToString.Exclude
    Set<UserChatConnection> users;

    @OneToMany(mappedBy = "chat")
    @ToString.Exclude
    List<Message> messages;

    private String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Chat chat = (Chat) o;
        return Objects.equals(id, chat.id) && Objects.equals(users, chat.users) && Objects.equals(messages, chat.messages) && Objects.equals(name, chat.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, users, messages, name);
    }
}
