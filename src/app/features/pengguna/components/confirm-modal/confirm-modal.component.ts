import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  // Input Signals (Angular 18+)
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmText = input<string>('Konfirmasi');
  readonly cancelText = input<string>('Batal');

  // Helper getters untuk template html
  get open$() {
    return this.open;
  }
  get title$() {
    return this.title;
  }
  get message$() {
    return this.message;
  }
  get confirmText$() {
    return this.confirmText;
  }
  get cancelText$() {
    return this.cancelText;
  }

  // Output events
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(): void {
    this.cancelled.emit();
  }
}
