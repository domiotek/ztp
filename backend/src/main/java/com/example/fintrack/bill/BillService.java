package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.AddBillDto;
import com.example.fintrack.bill.dto.AddBillEventDto;
import com.example.fintrack.bill.dto.BillDto;
import com.example.fintrack.bill.dto.EventBillDto;
import com.example.fintrack.category.Category;
import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.currency.CurrencyRepository;
import com.example.fintrack.event.Event;
import com.example.fintrack.event.EventRepository;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.user.UserRepository;
import com.example.fintrack.util.enums.SortDirection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

import static com.example.fintrack.bill.BillSpecification.*;
import static com.example.fintrack.bill.BillSpecification.hasCategoryId;
import static com.example.fintrack.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final CurrencyRepository currencyRepository;
    private final UserRepository userRepository;
    private final CurrencyConverter currencyConverter;
    private final UserProvider userProvider;

    public Page<EventBillDto> getEventBills(long eventId, int page, int size) {
        User user = userProvider.getLoggedUser();

        PageRequest pageRequest = PageRequest.of(page, size);

        Page<Bill> bills = billRepository.findBillsByEventId(eventId, pageRequest);

        return bills.map(bill -> BillMapper.billToEventBillDto(bill, currencyConverter, user));
    }

    public void addBillToEvent(AddBillEventDto addBillEventDto, long eventId) {
        User user = userRepository.findById(addBillEventDto.paidById()).orElseThrow(USER_DOES_NOT_EXIST::getError);
        Category category = categoryRepository.findById(addBillEventDto.categoryId())
                .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);
        Event event = eventRepository.findById(eventId).orElseThrow(EVENT_DOES_NOT_EXIST::getError);
        Currency currency = event.getCurrency();

        BigDecimal amountInEventCurrency = addBillEventDto.amount();
        BigDecimal amountInUSD = currencyConverter
                .convertFromGivenCurrencyToUSD(event.getCurrency(), amountInEventCurrency);

        Bill bill = new Bill();
        bill.setName(addBillEventDto.name());
        bill.setDate(addBillEventDto.date());
        bill.setAmount(amountInUSD);
        bill.setEvent(event);
        bill.setCurrency(currency);
        bill.setCategory(category);
        bill.setPaidBy(user);

        billRepository.save(bill);
    }

    public Page<BillDto> getBills(
            ZonedDateTime from, ZonedDateTime to, Long categoryId, SortDirection sortDirection, int page, int pageSize
    ) {
        User loggedUser = userProvider.getLoggedUser();

        Specification<Bill> billSpecification = hasUserId(loggedUser.getId());
        billSpecification = billSpecification.or(hasPaidById(loggedUser.getId()));
        if(from != null && to != null) {
            billSpecification = billSpecification.and(hasBillsBetweenDates(from, to));
        }
        if(categoryId != null) {
            billSpecification = billSpecification.and(hasCategoryId(categoryId));
        }

        Sort.Direction sortDirectionSpringEnum = sortDirection.toSortDirection();
        PageRequest pageRequest = PageRequest.of(page, pageSize, Sort.by(sortDirectionSpringEnum, "category"));
        Page<Bill> bills = billRepository.findAll(billSpecification, pageRequest);

        return bills.map(bill -> BillMapper.billToBillDto(bill, currencyConverter, loggedUser));
    }

    public void addBill(AddBillDto addBillDto) {
        Category category = null;
        Event event = null;
        User user;
        if(addBillDto.categoryId() != null) {
            category = categoryRepository.findById(addBillDto.categoryId())
                    .orElseThrow(CATEGORY_DOES_NOT_EXIST::getError);
        }
        if(addBillDto.eventId() != null) {
            event = eventRepository.findById(addBillDto.eventId()).orElseThrow(EVENT_DOES_NOT_EXIST::getError);
            user = userRepository.findById(addBillDto.paidBy()).orElseThrow(USER_DOES_NOT_EXIST::getError);
        } else {
            user = userRepository.findById(addBillDto.userId()).orElseThrow(USER_DOES_NOT_EXIST::getError);
        }
        Currency currency = currencyRepository.getReferenceById(addBillDto.currencyId());
        Bill bill = BillMapper.addBillDtoToBill(addBillDto, category, currency, event, user);

        billRepository.save(bill);
    }
}
