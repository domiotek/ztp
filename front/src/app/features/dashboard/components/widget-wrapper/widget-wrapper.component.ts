import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, DestroyRef, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';
import { IWidget } from '../../models/widget';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-widget-wrapper',
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  templateUrl: './widget-wrapper.component.html',
  styleUrl: './widget-wrapper.component.scss',
})
export class WidgetWrapperComponent implements AfterContentInit {
  @ContentChild('widgetContent') widget!: IWidget;

  header = input.required<string>();

  loading = signal(true);
  loadingError = signal(false);
  refreshing = signal(false);
  hasInteraction = signal(false);

  destryRef = inject(DestroyRef);

  ngAfterContentInit(): void {
    if (!this.widget) {
      // eslint-disable-next-line no-console
      console.warn(`Widget content for '${this.header()}' not found!`);
      return;
    }

    this.widget.onInit$.pipe(take(1)).subscribe((config) => {
      this.hasInteraction.set(config.hasInteraction);
    });

    this.widget.onLoad$.pipe(takeUntilDestroyed(this.destryRef)).subscribe((hasLoaded) => {
      this.loading.set(false);
      this.loadingError.set(!hasLoaded);
      this.refreshing.set(false);
    });

    this.widget.onRefresh$.pipe(takeUntilDestroyed(this.destryRef)).subscribe(() => {
      this.loading.set(true);
      this.loadingError.set(false);
      this.refreshing.set(true);
    });
  }

  triggerInteraction() {
    if (this.widget) {
      this.widget.triggerAction();
    }
  }
}
