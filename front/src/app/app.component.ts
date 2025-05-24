import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pl' }, provideLuxonDateAdapter()],
})
export class AppComponent {
  title = 'Fintrack';
}
