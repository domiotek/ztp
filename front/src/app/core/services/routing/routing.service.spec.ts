import { TestBed } from '@angular/core/testing';

import { RoutingService } from './routing.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('RoutingService', () => {
  let service: RoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    service = TestBed.inject(RoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
