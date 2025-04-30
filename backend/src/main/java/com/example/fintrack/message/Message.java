package com.example.fintrack.message;

import com.example.fintrack.chat.Chat;
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
@Table(name="messages")
public class Message {

    @Id
    @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "message")
    private Set<LastReadMessage> lastReadMessages;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @Column(nullable = false)
    private String value;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Message message = (Message) o;
        return Objects.equals(id, message.id) && Objects.equals(lastReadMessages, message.lastReadMessages) && Objects.equals(chat, message.chat) && Objects.equals(value, message.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, lastReadMessages, chat, value);
    }
}
