import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="container">
      <h1>Hello World 👋</h1>
      <p class="subtitle">Angular UI talking to the backend weather service.</p>

      <button (click)="loadWeather()" [disabled]="loading()">
        {{ loading() ? 'Loading…' : 'Get Weather' }}
      </button>

      <p class="error" *ngIf="error()">{{ error() }}</p>

      <table *ngIf="forecasts().length" class="forecast">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp (°C)</th>
            <th>Temp (°F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let f of forecasts()">
            <td>{{ f.date }}</td>
            <td>{{ f.temperatureC }}</td>
            <td>{{ f.temperatureF }}</td>
            <td>{{ f.summary }}</td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
  styles: [`
    .container {
      max-width: 640px;
      margin: 4rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }
    h1 { margin: 0 0 0.25rem; }
    .subtitle { margin: 0 0 1.5rem; color: #616e7c; }
    button {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
    }
    button:disabled { opacity: 0.6; cursor: default; }
    .error { color: #c0392b; }
    table.forecast {
      margin-top: 1.5rem;
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      text-align: left;
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid #e4e7eb;
    }
    th { color: #52606d; font-weight: 600; }
  `]
})
export class AppComponent {
  forecasts = signal<WeatherForecast[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Base URL of the backend API. Injected at container runtime via env.js
  // (see docker-env.sh); falls back to localhost for non-container dev.
  private readonly apiBase =
    (window as any).__API_BASE__ || 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  loadWeather(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<WeatherForecast[]>(`${this.apiBase}/weatherforecast`).subscribe({
      next: (data) => {
        this.forecasts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to reach backend: ' + (err.message ?? 'unknown error'));
        this.loading.set(false);
      }
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
});
