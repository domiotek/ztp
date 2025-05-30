package com.example.fintrack.bill;

import com.example.fintrack.bill.dto.AddBillDto;
import com.example.fintrack.bill.dto.BillDto;
import com.example.fintrack.util.enums.SortDirection;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;

@RestController
@RequestMapping("/bills")
@AllArgsConstructor
public class BillController {

    private BillService billService;

    @GetMapping
    public ResponseEntity<Page<BillDto>> getBills(
            @RequestParam ZonedDateTime from,
            @RequestParam ZonedDateTime to,
            @RequestParam (required = false) Long categoryId,
            @RequestParam SortDirection sortDirection,
            @RequestParam int page,
            @RequestParam int pageSize
            ) {
        return ResponseEntity.ok().body(billService.getBills(from, to, categoryId, sortDirection, page, pageSize));
    }

    @PostMapping
    public ResponseEntity<AddBillDto> addBill(@RequestBody @Valid AddBillDto addBillDto) {
        billService.addBill(addBillDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
