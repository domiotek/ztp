package com.example.fintrack.currency;

import com.example.fintrack.rate.Rate;
import com.example.fintrack.rate.RateMapper;
import com.example.fintrack.rate.RateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CurrencyService {

    private final RateRepository rateRepository;

    public List<CurrencyDto> getCurrenciesWithLatestRate() {
        LocalDate now = LocalDate.now();
        ZonedDateTime startDate = now.atStartOfDay().atZone(ZoneId.systemDefault());
        ZonedDateTime endDate = startDate.plusDays(1);

        List<Rate> rates = rateRepository.findRatesByDateBetween(startDate, endDate);

        return rates.stream()
                .map(RateMapper::rateToCurrencyDto)
                .toList();
    }
}
