package com.example.fintrack.event;

import com.example.fintrack.bill.Bill;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.currency.CurrencyRepository;
import com.example.fintrack.event.dto.*;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.userevent.UserEvent;
import com.example.fintrack.userevent.UserEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.fintrack.exception.BusinessErrorCodes.*;
import static com.example.fintrack.userevent.UserEventSpecification.*;

@Service
@RequiredArgsConstructor
public class EventService {

    private final UserEventRepository userEventRepository;
    private final EventRepository eventRepository;
    private final UserProvider userProvider;
    private final CurrencyRepository currencyRepository;
    private final CurrencyConverter currencyConverter;

    public Page<EventDto> getUserEvents(
            String name, EventStatus eventStatus, ZonedDateTime fromDate, ZonedDateTime toDate, int page, int size
    ) {
        User loggedUser = userProvider.getLoggedUser();

        Specification<UserEvent> eventSpecification = hasUserId(loggedUser.getId());
        if (name != null) {
            eventSpecification = eventSpecification.and(hasEventName(name));
        }
        if (eventStatus != null) {
            eventSpecification = eventSpecification.and(hasEventStatus(eventStatus));
        }
        if (fromDate != null) {
            eventSpecification = eventSpecification.and(hasEventStartedAfter(fromDate));
        }
        if (toDate != null) {
            eventSpecification = eventSpecification.and(hasEventStartedBefore(toDate));
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("event.startDateTime").ascending());
        Page<UserEvent> userEvents = userEventRepository.findAll(eventSpecification, pageRequest);

        return userEvents.map(EventMapper::userEventToEventDto);
    }

    public void addEvent(AddEventDto addEventDto) {
        Currency currency = currencyRepository.findById(addEventDto.currencyId())
                .orElseThrow(CURRENCY_DOES_NOT_EXIST::getError);

        Event event = new Event();
        event.setName(addEventDto.name());
        event.setCurrency(currency);
        event.setStartDateTime(addEventDto.startDate());
        event.setEndDateTime(addEventDto.endDate());

        eventRepository.save(event);

        User user = userProvider.getLoggedUser();

        UserEvent userEvent = new UserEvent();
        userEvent.setEvent(event);
        userEvent.setUser(user);
        userEvent.setIsFounder(true);

        userEventRepository.save(userEvent);
    }

    public EventSummaryDto getEventSummary(long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);
        User user = userProvider.getLoggedUser();

        BigDecimal totalSum = event.getBills().stream()
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal costPerUser = totalSum.divide(
                BigDecimal.valueOf(event.getUsers().size()), 2, RoundingMode.HALF_UP
        );

        BigDecimal totalSumInEventCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(event.getCurrency(), event.getStartDateTime().toLocalDate(), totalSum);
        BigDecimal totalCostPerUserInEventCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(event.getCurrency(), event.getStartDateTime().toLocalDate(), costPerUser);

        BigDecimal totalSumInUserCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(user.getCurrency(), event.getStartDateTime().toLocalDate(), totalSum);
        BigDecimal totalCostPerUserInUserCurrency = currencyConverter
                .convertFromUSDToGivenCurrency(event.getCurrency(), event.getStartDateTime().toLocalDate(), costPerUser);

        return EventSummaryDto.builder()
                .eventCurrency(EventSummaryCurrencyDto.builder()
                        .totalSum(totalSumInEventCurrency)
                        .costPerUser(totalCostPerUserInEventCurrency)
                        .build()
                )
                .userCurrency(EventSummaryCurrencyDto.builder()
                        .totalSum(totalSumInUserCurrency)
                        .costPerUser(totalCostPerUserInUserCurrency)
                        .build()
                )
                .build();
    }

    public List<Long> getUsersWhoPaidInEvent(long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);

        List<User> users = new ArrayList<>(
                event.getBills().stream()
                        .map(Bill::getPaidBy)
                        .distinct()
                        .toList()
        );

        UserEvent userEvent = event.getUsers().stream()
                .filter(UserEvent::getIsFounder)
                .findFirst()
                .orElseThrow(USER_DOES_NOT_EXIST::getError);

        User user = userEvent.getUser();
        if (!users.contains(user)) {
            users.add(user);
        }

        return users.stream()
                .map(User::getId)
                .toList();
    }

    public List<SettlementDto> getSettlements(long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);

        Map<User, BigDecimal> totalSettlements = calculateTotalSettlements(event);

        Map<User, Map<User, BigDecimal>> settlements = calculateSettlements(totalSettlements, event);

        User loggedUser = userProvider.getLoggedUser();

        Map<User, BigDecimal> result = settlements.get(loggedUser);

        return result.entrySet().stream()
                .map(entry -> EventMapper.settlementEntryToSettlementDto(entry, currencyConverter, event, loggedUser))
                .toList();
    }

    private Map<User, BigDecimal> calculateTotalSettlements(Event event) {
        Set<Bill> bills = event.getBills();

        BigDecimal totalSum = bills.stream()
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal averageCostPerUser = totalSum.divide(
                BigDecimal.valueOf(event.getUsers().size()), 2, RoundingMode.HALF_UP
        );

        Map<User, BigDecimal> realCostPerUser = event.getUsers().stream()
                .map(UserEvent::getUser)
                .collect(Collectors.toMap(user -> user, user -> BigDecimal.ZERO, (u1, u2) -> u1));
        for (Bill bill : bills) {
            realCostPerUser.put(bill.getPaidBy(), realCostPerUser.get(bill.getPaidBy()).add(bill.getAmount()));
        }

        Map<User, BigDecimal> totalSettlements = new HashMap<>();
        for (Map.Entry<User, BigDecimal> pair: realCostPerUser.entrySet()) {
            totalSettlements.put(pair.getKey(), pair.getValue().subtract(averageCostPerUser));
        }

        return totalSettlements;
    }

    private Map<User, Map<User, BigDecimal>> calculateSettlements(Map<User, BigDecimal> totalSettlements, Event event) {
        List<Map.Entry<User, BigDecimal>> entries = totalSettlements.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .toList();

        Map<User, Map<User, BigDecimal>> settlements = event.getUsers().stream()
                .map(UserEvent::getUser)
                .collect(Collectors.toMap(user -> user, user -> new HashMap<>(), (u1, u2) -> u1));

        int start = 0;
        int end = entries.size() - 1;

        while (start < end) {
            Map.Entry<User, BigDecimal> startEntry = entries.get(start);
            Map.Entry<User, BigDecimal> endEntry = entries.get(end);

            if (startEntry.getValue().negate().compareTo(endEntry.getValue()) < 0) {
                settlements.get(startEntry.getKey()).put(endEntry.getKey(), startEntry.getValue());
                settlements.get(endEntry.getKey()).put(startEntry.getKey(), startEntry.getValue().negate());

                startEntry.setValue(startEntry.getValue().subtract(startEntry.getValue()));
                endEntry.setValue(endEntry.getValue().add(startEntry.getValue()));

                start++;
            } else {
                settlements.get(startEntry.getKey()).put(endEntry.getKey(), endEntry.getValue().negate());
                settlements.get(endEntry.getKey()).put(startEntry.getKey(), endEntry.getValue());

                startEntry.setValue(startEntry.getValue().add(endEntry.getValue()));
                endEntry.setValue(endEntry.getValue().subtract(endEntry.getValue()));

                end--;
            }
        }

        return settlements;
    }
}
