package com.example.fintrack.friend;

import com.example.fintrack.chat.Chat;
import com.example.fintrack.chat.ChatRepository;
import com.example.fintrack.chat.ChatService;
import com.example.fintrack.friend.dto.AcceptFriendRequest;
import com.example.fintrack.friend.dto.FriendDto;
import com.example.fintrack.friend.dto.FriendRequestDto;
import com.example.fintrack.friend.dto.SendFriendRequestDto;
import com.example.fintrack.lastreadmessage.LastReadMessage;
import com.example.fintrack.lastreadmessage.LastReadMessageRepository;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static com.example.fintrack.exception.BusinessErrorCodes.ALREADY_FRIENDS;
import static com.example.fintrack.exception.BusinessErrorCodes.CANNOT_INVITE_YOURSELF;
import static com.example.fintrack.friend.FriendSpecification.*;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRepository friendRepository;
    private final UserProvider userProvider;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;
    private final LastReadMessageRepository lastReadMessageRepository;
    private final ChatService chatService;

    public List<FriendRequestDto> getFriendRequests() {
        User user = userProvider.getLoggedUser();

        Specification<Friend> friendSpecification = hasUserId(user.getId()).and(hasFriendStatus(FriendStatus.PENDING));

        List<Friend> friends = friendRepository.findAll(friendSpecification);

        return friends.stream()
                .map(FriendMapper::userToFriendRequestDto)
                .toList();
    }

    public void deleteFriend(long friendId) {
        User user = userProvider.getLoggedUser();

        Specification<Friend> friendSpecification = hasUserIdAndFriendId(user.getId(), friendId);

        List<Friend> friends = friendRepository.findAll(friendSpecification);
        friends.forEach(friend -> friend.setFriendStatus(FriendStatus.DELETED));

        friendRepository.saveAll(friends);

        chatService.sendPrivateChatUpdatesFriend(friends);
    }

    public void sendFriendRequest(SendFriendRequestDto sendFriendRequestDto) {
        User user = userProvider.getLoggedUser();

        if (user.getEmail().equals(sendFriendRequestDto.email())) {
            throw CANNOT_INVITE_YOURSELF.getError();
        }

        Optional<User> userOptional = userRepository.findUserByEmail(sendFriendRequestDto.email());
        if (userOptional.isEmpty()) {
            return;
        }

        User friend = userOptional.get();

        Specification<Friend> friendSpecification = hasUserIdAndFriendId(user.getId(), friend.getId());

        List<Friend> friends = friendRepository.findAll(friendSpecification);

        if (!friends.isEmpty()) {
            friends.forEach(f -> {
                if (f.getFriendStatus() == FriendStatus.ACCEPTED) {
                    throw ALREADY_FRIENDS.getError();
                }

                if (f.getUser().equals(user)) {
                    f.setFriendStatus(FriendStatus.REQUESTED);
                } else {
                    f.setFriendStatus(FriendStatus.PENDING);
                }
            });

            friendRepository.saveAll(friends);
        } else {
            Chat chat = new Chat();
            chat.setIsStarted(false);

            chatRepository.save(chat);

            Friend friend1 = new Friend();
            friend1.setUser(user);
            friend1.setFriend(friend);
            friend1.setFriendStatus(FriendStatus.REQUESTED);
            friend1.setCreatedAt(ZonedDateTime.now());
            friend1.setChat(chat);

            Friend friend2 = new Friend();
            friend2.setUser(friend);
            friend2.setFriend(user);
            friend2.setFriendStatus(FriendStatus.PENDING);
            friend2.setCreatedAt(ZonedDateTime.now());
            friend2.setChat(chat);

            friendRepository.saveAll(List.of(friend1, friend2));

            LastReadMessage lastReadMessage1 = new LastReadMessage();
            lastReadMessage1.setChat(chat);
            lastReadMessage1.setUser(user);

            LastReadMessage lastReadMessage2 = new LastReadMessage();
            lastReadMessage2.setChat(chat);
            lastReadMessage2.setUser(friend);

            lastReadMessageRepository.saveAll(List.of(lastReadMessage1, lastReadMessage2));
        }
    }

    public void acceptFriendRequest(long friendId, AcceptFriendRequest acceptFriendRequest) {
        if (!acceptFriendRequest.accept()) {
            deleteFriend(friendId);
            return;
        }

        User user = userProvider.getLoggedUser();

        Specification<Friend> friendSpecification = hasUserIdAndFriendId(user.getId(), friendId);

        List<Friend> friends = friendRepository.findAll(friendSpecification);

        friends.forEach(friend -> friend.setFriendStatus(FriendStatus.ACCEPTED));

        friendRepository.saveAll(friends);

        chatService.sendPrivateChatUpdatesFriend(friends);
    }

    public List<FriendDto> getFriends(String search) {
        User user = userProvider.getLoggedUser();

        Specification<Friend> friendSpecification = hasUserId(user.getId()).and(hasFriendStatus(FriendStatus.ACCEPTED));
        if (search != null) {
            friendSpecification = friendSpecification.and(hasFriendContainingText(search));
        }

        List<Friend> friends = friendRepository.findAll(friendSpecification);

        return friends.stream()
                .map(FriendMapper::userToFriendDto)
                .toList();
    }
}
