import { Component, input } from '@angular/core';
import { Category } from '../../../core/models/category/category.model';
import { Currency } from '../../../core/models/currency/currency.model';

@Component({
  selector: 'app-category-item',
  imports: [],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
})
export class CategoryItemComponent {
  item = input.required<Category>();

  currency = input.required<Currency | null>();
}
