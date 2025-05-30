import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TimeRangeSelectorComponent } from '../../../../shared/components/time-range-selector/time-range-selector.component';
import { TimeRange } from '../../../../core/models/time-range/time-range';
import { EMPTY_CATEGORY_STATE } from '../../constants/empty-category-state';
import { CategoryStateStore } from '../../store/category-state.store';
import { callDebounced as debounceHandler } from '../../../../utils/debouncer';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateTime } from 'luxon';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { SortMenuComponent } from '../../../../shared/components/sort-menu/sort-menu.component';
import { FormsModule } from '@angular/forms';
import { SortState } from '../../../../core/models/sort/sort-state';
import { SortItem } from '../../../../core/models/sort/sort-item';
import { CATEGORIES_SORT_ITEMS } from '../../constants/categories-sort-items';
import { CATEGORIES_START_SORT_STATE } from '../../constants/categories-start-sort-state';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { CategoryService } from '../../../../core/services/category/category.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Category } from '../../../../core/models/category/category.model';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { CategoryDetailsComponent } from '../../components/category-details/category-details.component';
import { NoSelectedComponent } from '../../../../shared/components/no-selected/no-selected.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { tap } from 'rxjs';
import { CategoryItemComponent } from '../../../../shared/components/category-item/category-item.component';
import { RoutingService } from '../../../../core/services/routing/routing.service';

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule,
    TimeRangeSelectorComponent,
    MatButton,
    MatIconModule,
    SearchInputComponent,
    SortMenuComponent,
    FormsModule,
    CustomListComponent,
    CategoryItemComponent,
    AsyncPipe,
    CategoryDetailsComponent,
    NoSelectedComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  private readonly appStateStore = inject(AppStateStore);

  private readonly destroyRef = inject(DestroyRef);

  private readonly categoryState = inject(CategoryStateStore);

  private readonly observer = inject(BreakpointObserver);

  private readonly routingService = inject(RoutingService);

  readonly timeRange = signal<TimeRange>(EMPTY_CATEGORY_STATE.timeRange);

  readonly isMobile = signal<boolean>(false);
  readonly selectedCategory = signal<Category | null>(null);

  projection_range = computed(() => ({
    from: this.timeRange().from.startOf('month'),
    to: this.timeRange().to.endOf('month'),
  }));

  readonly dateLabel = computed(() => {
    const range = this.projection_range();

    if (DateTime.now().hasSame(range.from, 'year')) {
      return range.from.toFormat('LLLL');
    }

    return range.from.toFormat('LLLL yyyy');
  });

  rangeConstraints = computed(() => {
    return {
      max: DateTime.now().endOf('month'),
    };
  });

  readonly searchValue = signal<string>('');

  readonly sortOptions = signal<SortItem[]>(CATEGORIES_SORT_ITEMS);

  readonly sortState = signal<SortState>(CATEGORIES_START_SORT_STATE);

  readonly categories = this.categoryService.getCategories();

  readonly userCurrency$ = this.appStateStore.userDefaultCurrency$;

  ngOnInit(): void {
    this.observer
      .observe('(max-width: 768px)')
      .pipe(
        tap((res) => {
          this.isMobile.set(res.matches);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.categoryService.getCategoriesList().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

    const routingState = this.routingService.getAndConsumeNavigationState();

    if (routingState['categoryId']) {
      const categoryId = routingState['categoryId'];
      this.selectedCategory.set(this.categories().find((c) => c.id === categoryId) ?? null);
    }

    if (routingState['timeRange']) {
      this.timeRange.set(routingState['timeRange'] as TimeRange);
    }
  }

  onProjectionDateChange = debounceHandler((timeRange: TimeRange) => {
    this.categoryState.setTimeRange(timeRange);
    this.timeRange.set(timeRange);
  }, 300);

  onSearch(val: string): void {}

  onSortChange(state: SortState): void {
    this.sortState.set({ ...state });
  }

  onCategorySelect(category: Category | null): void {
    if (!category) {
      this.selectedCategory.set(null);
      // return; sonar sie czepia
    }
  }
}
