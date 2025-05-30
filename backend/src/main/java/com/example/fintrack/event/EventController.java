package com.example.fintrack.event;

import com.example.fintrack.bill.dto.AddBillEventDto;
import com.example.fintrack.bill.dto.EventBillDto;
import com.example.fintrack.bill.BillService;
import com.example.fintrack.event.dto.*;
import com.example.fintrack.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserService userService;
    private final BillService billService;

    @GetMapping
    public ResponseEntity<Page<EventDto>> getUserEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) EventStatus eventStatus,
            @RequestParam(required = false) ZonedDateTime fromDate,
            @RequestParam(required = false) ZonedDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(eventService.getUserEvents(name, eventStatus, fromDate, toDate, page, size));
    }

    @GetMapping("/{event-id}/bills")
    public ResponseEntity<Page<EventBillDto>> getEventBills(
            @PathVariable("event-id") long eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(billService.getEventBills(eventId, page, size));
    }

    @GetMapping("/{event-id}/summary")
    public ResponseEntity<EventSummaryDto> getEventSummary(@PathVariable("event-id") long eventId) {
        return ResponseEntity.ok().body(eventService.getEventSummary(eventId));
    }

    @PostMapping
    public ResponseEntity<Void> addEvent(@RequestBody @Valid AddEventDto addEventDto) {
        eventService.addEvent(addEventDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{event-id}/bills")
    public ResponseEntity<Void> addBillToEvent(
            @RequestBody AddBillEventDto addBillEventDto,
            @PathVariable("event-id") long eventId
    ) {
        billService.addBillToEvent(addBillEventDto, eventId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{event-id}/users/{user-id}")
    public ResponseEntity<Void> addUserToEvent(
            @PathVariable("event-id") long eventId,
            @PathVariable("user-id") long userId
    ) {
        userService.addUserToEvent(eventId, userId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{event-id}/users/{user-id}")
    public ResponseEntity<Void> deleteUserFromEvent(
            @PathVariable("event-id") long eventId,
            @PathVariable("user-id") long userId
    ) {
        userService.deleteUserFromEvent(eventId, userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{event-id}/users-who-paid")
    public ResponseEntity<List<Long>> getUsersWhoPaid(@PathVariable("event-id") long eventId) {
        return ResponseEntity.ok().body(eventService.getUsersWhoPaidInEvent(eventId));
    }

    @GetMapping("/{event-id}/settlements")
    public ResponseEntity<List<SettlementDto>> getSettlements(@PathVariable("event-id") long eventId) {
        return ResponseEntity.ok().body(eventService.getSettlements(eventId));
    }
}
