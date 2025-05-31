import { Observable } from 'rxjs';

export interface IWidget {
  onInit$: Observable<IWidgetConfig>;
  onLoad$: Observable<boolean>;
  onRefresh$: Observable<void>;

  loadData(): void;
  triggerAction(): void;
}

export interface IWidgetConfig {
  hasInteraction: boolean;
}
