import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './shared/components/notification/notification';
import { LoaderComponent } from './shared/components/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-trade-licenses-app');
}
