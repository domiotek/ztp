import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendItemComponent } from './friend-item.component';

describe('FriendItemComponent', () => {
  let component: FriendItemComponent;
  let fixture: ComponentFixture<FriendItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
