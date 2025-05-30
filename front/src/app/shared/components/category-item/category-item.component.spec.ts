import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryItemComponent } from './category-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('CategoryItemComponent', () => {
  let component: CategoryItemComponent;
  let fixture: ComponentFixture<CategoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [CategoryItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('item', {
      id: '1',
      name: 'Test Category',
      color: '#ff0000',
      limit: 100,
      spendLimit: 1000,
    });

    fixture.componentRef.setInput('currency', {
      id: 1,
      name: 'Złoty',
      code: 'zł',
      rate: 1,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
