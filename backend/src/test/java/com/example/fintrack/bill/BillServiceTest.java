package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.AddBillDto;
import com.example.fintrack.bill.dto.UpdateBillDto;
import com.example.fintrack.category.Category;
import com.example.fintrack.category.CategoryRepository;
import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyConverter;
import com.example.fintrack.currency.CurrencyRepository;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class BillServiceTest {

    @Mock private BillRepository billRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private CurrencyRepository currencyRepository;
    @Mock private UserProvider userProvider;
    @Mock private CurrencyConverter currencyConverter;

    @InjectMocks private BillService billService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        when(userProvider.getLoggedUser()).thenReturn(user);
    }

    @Test
    void shouldAddUserBill() {
        AddBillDto dto = new AddBillDto("Test", BigDecimal.TEN, 1L, 1L, ZonedDateTime.now());
        Category category = new Category();
        Currency currency = new Currency();

        when(categoryRepository.findCategoryByIdAndUserId(eq(1L), eq(user.getId()))).thenReturn(Optional.of(category));
        when(currencyRepository.findById(eq(1L))).thenReturn(Optional.of(currency));
        when(currencyConverter.convertFromGivenCurrencyToUSD(any(), any()))
                .thenAnswer(invocation -> invocation.getArgument(1));

        billService.addUserBill(dto);

        verify(billRepository).save(any(Bill.class));
    }

    @Test
    void shouldThrowIfCategoryNotFound() {
        AddBillDto dto = new AddBillDto("Test", BigDecimal.TEN, 99L, 1L, ZonedDateTime.now());

        when(categoryRepository.findCategoryByIdAndUserId(anyLong(), anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> billService.addUserBill(dto));
    }

    @Test
    void shouldUpdateUserBill() {
        UpdateBillDto dto = new UpdateBillDto("Updated", ZonedDateTime.now(), BigDecimal.ONE, null);
        Bill bill = new Bill();

        when(billRepository.findBillByIdAndUserId(anyLong(), eq(user.getId()))).thenReturn(Optional.of(bill));

        billService.updateUserBill(1L, dto);

        verify(billRepository).save(bill);
        assertThat(bill.getName()).isEqualTo("Updated");
    }

    @Test
    void shouldDeleteUserBill() {
        Bill bill = new Bill();

        when(billRepository.findBillByIdAndUserId(eq(1L), eq(user.getId()))).thenReturn(Optional.of(bill));

        billService.deleteUserBill(1L);

        verify(billRepository).delete(bill);
    }
}
