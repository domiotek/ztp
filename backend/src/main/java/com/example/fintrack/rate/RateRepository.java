package com.example.fintrack.rate;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.ZonedDateTime;
import java.util.List;

public interface RateRepository extends JpaRepository<Rate, Long> {

    List<Rate> findRatesByDateBetween(ZonedDateTime startDate, ZonedDateTime endDate);
}
