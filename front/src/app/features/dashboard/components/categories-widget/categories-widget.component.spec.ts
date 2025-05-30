import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesWidgetComponent } from './categories-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { CategoryService } from '../../../../core/services/category/category.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { provideHttpClient } from '@angular/common/http';

describe('CategoriesWidgetComponent', () => {
  let component: CategoriesWidgetComponent;
  let fixture: ComponentFixture<CategoriesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesWidgetComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        AppStateStore,
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
