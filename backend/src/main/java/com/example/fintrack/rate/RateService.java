package com.example.fintrack.rate;

import com.example.fintrack.currency.Currency;
import com.example.fintrack.currency.CurrencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.List;

import static com.example.fintrack.exception.BusinessErrorCodes.*;

@Service
@RequiredArgsConstructor
public class RateService {

    private final RestClient restClient = RestClient.builder().baseUrl("https://api.frankfurter.dev/v1").build();
    private final RateRepository rateRepository;
    private final CurrencyRepository currencyRepository;

    private RatesDto fetchRates() {
        ResponseEntity<RatesDto> responseEntity = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/latest")
                        .queryParam("base", "USD")
                        .build()
                )
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .toEntity(RatesDto.class);

        if (!(responseEntity.getStatusCode() == HttpStatus.OK)) {
            throw REQUEST_FAILED.getError();
        }

        RatesDto ratesDto = responseEntity.getBody();
        if (ratesDto == null) {
            throw MISSING_REQUEST_BODY.getError();
        }

        return ratesDto;
    }

    @Scheduled(cron = "0 0 0 * * *")
    private void updateRates() {
        RatesDto ratesDto = fetchRates();

        List<Currency> currencies = currencyRepository.findAll();

        ZonedDateTime now = ZonedDateTime.now();

        List<Rate> rates = currencies.stream()
                .map(currency -> {
                    Rate rate = new Rate();
                    rate.setCurrency(currency);
                    rate.setDate(now);
                    if (currency.getCode().equals("USD")) {
                        rate.setAmount(BigDecimal.ONE);
                    } else {
                        rate.setAmount(ratesDto.rates().get(currency.getCode())
                                .setScale(4, RoundingMode.HALF_UP));
                    }
                    return rate;
                })
                .toList();

        rateRepository.saveAll(rates);
    }
}
