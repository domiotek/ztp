import { Component, inject, OnInit, signal } from '@angular/core';
import { IWidget } from '../../models/widget';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { CategoryService } from '../../../../core/services/category/category.service';
import { Category } from '../../../../core/models/category/category.model';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { CommonModule } from '@angular/common';
import { CategoryItemComponent } from '../../../../shared/components/category-item/category-item.component';

@Component({
  selector: 'app-categories-widget',
  imports: [CommonModule, CustomListComponent, CategoryItemComponent],
  templateUrl: './categories-widget.component.html',
  styleUrl: './categories-widget.component.scss',
})
export class CategoriesWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
  readonly categories = signal<Category[]>([]);

  readonly categoryService = inject(CategoryService);
  readonly appStateStore = inject(AppStateStore);

  override ngOnInit() {
    this.onInit.next({
      hasInteraction: true,
    });

    super.ngOnInit();
  }

  loadData(): void {
    this.categoryService
      .getCategoriesList({
        size: 5,
        from: this.timeRange().from.toUTC().toISO()!,
        to: this.timeRange().to.toUTC().toISO()!,
      })
      .subscribe({
        next: (categories) => {
          this.categories.set(categories.content);
          this.onLoad.next(true);
        },
        error: () => {
          this.onLoad.next(false);
        },
      });
  }

  override triggerAction(): void {
    this.routingService.navigate(['/categories'], { timeRange: this.timeRange() });
  }

  onSelectCategory(category: Category): void {
    this.routingService.navigate(['/categories'], { categoryId: category.id, timeRange: this.timeRange() });
  }
}
