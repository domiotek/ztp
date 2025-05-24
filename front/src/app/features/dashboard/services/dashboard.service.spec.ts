import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
