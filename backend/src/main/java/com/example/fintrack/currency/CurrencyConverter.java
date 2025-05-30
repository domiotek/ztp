package com.example.fintrack.currency;

import com.example.fintrack.rate.Rate;
import com.example.fintrack.rate.RateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.ZoneId;
import java.util.List;

import static com.example.fintrack.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class CurrencyConverter {

    private final RateRepository rateRepository;
    private final CurrencyRepository currencyRepository;

    public BigDecimal convertFromGivenCurrencyToUSD(Currency currency, BigDecimal amount) {
        Currency usd = currencyRepository.findCurrencyByCode("USD")
                .orElseThrow(CURRENCY_DOES_NOT_EXIST::getError);

        return convertWithRatesFromGivenDay(currency, usd, amount, LocalDate.now());
    }

    public BigDecimal convertFromUSDToGivenCurrency(Currency currency, LocalDate date, BigDecimal amount) {
        Currency usd = currencyRepository.findCurrencyByCode("USD")
                .orElseThrow(CURRENCY_DOES_NOT_EXIST::getError);

        return convertWithRatesFromGivenDay(usd, currency, amount, date);
    }

    private BigDecimal convertWithRatesFromGivenDay(
            Currency fromCurrency, Currency toCurrency, BigDecimal amount, LocalDate date
    ) {
        ZonedDateTime startDate = date.atStartOfDay(ZoneId.systemDefault());
        ZonedDateTime endDate = startDate.plusDays(1);

        List<Rate> rates = rateRepository.findRatesByDateBetween(startDate, endDate);

        Rate fromRate = rates.stream()
                .filter(rate -> rate.getCurrency().equals(fromCurrency))
                .findFirst()
                .orElseThrow();

        Rate toRate = rates.stream()
                .filter(rate -> rate.getCurrency().equals(toCurrency))
                .findFirst()
                .orElseThrow();

        return amount.divide(fromRate.getAmount(), 2, RoundingMode.HALF_UP).multiply(toRate.getAmount())
                .setScale(2, RoundingMode.HALF_UP);
    }
}
