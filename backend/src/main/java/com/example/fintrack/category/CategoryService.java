package com.example.fintrack.category;

import com.example.fintrack.category.dto.CategoryDto;
import com.example.fintrack.security.service.UserProvider;
import com.example.fintrack.user.User;
import com.example.fintrack.util.enums.SortDirection;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

import static com.example.fintrack.category.CategorySpecification.*;


@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserProvider userProvider;

    public Page<CategoryDto> getCategories(
            String name, ZonedDateTime from, ZonedDateTime to, SortDirection sortOrder, int page, int size
    ) {
        User loggedUser = userProvider.getLoggedUser();

        Specification<Category> categorySpecification = hasUserId(loggedUser.getId());
        if(name != null && !name.isEmpty()) {
            categorySpecification = categorySpecification.and(hasCategoryName(name));
        }
        if(from != null) {
            categorySpecification = categorySpecification.and(hasCategoryLimitsAfter(from));
        }
        if(to != null) {
            categorySpecification = categorySpecification.and(hasCategoryLimitsBefore(to));
        }
        if(from != null && to != null) {
            categorySpecification = categorySpecification.and(hasCategoryBillsBetween(from, to));
        }

        Sort.Direction sortDirection = sortOrder.toSortDirection();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, "name"));
        Page<Category> categories = categoryRepository.findAll(categorySpecification, pageRequest);

        return categories.map(CategoryMapper::categoryToCategoryDto);
    }
}
