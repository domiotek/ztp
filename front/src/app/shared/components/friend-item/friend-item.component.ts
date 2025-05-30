import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-friend-item',
  imports: [CommonModule, MatIconModule],
  templateUrl: './friend-item.component.html',
  styleUrl: './friend-item.component.scss',
})
export class FriendItemComponent {
  item = input.required<any>();
}
