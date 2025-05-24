import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetWrapperComponent } from './widget-wrapper/widget-wrapper.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('WidgetWrapperComponent', () => {
  let component: WidgetWrapperComponent;
  let fixture: ComponentFixture<WidgetWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetWrapperComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetWrapperComponent);
    fixture.componentRef.setInput('header', 'test header');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
