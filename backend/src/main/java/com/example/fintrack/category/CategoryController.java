package com.example.fintrack.category;

import com.example.fintrack.category.dto.CategoryDto;
import com.example.fintrack.util.enums.SortDirection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Page<CategoryDto>> getCategories(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) ZonedDateTime from,
            @RequestParam(required = false) ZonedDateTime to,
            @RequestParam(required = false) SortDirection sortDirection,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok().body(categoryService.getCategories(name, from, to, sortDirection, page, size));
    }
}
