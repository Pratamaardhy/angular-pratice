import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  host: {
    class: 'block w-full border-none outline-none bg-transparent p-0 m-0',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor {
  // Input Signals dari Parent
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'email' | 'password' | 'tel' | 'number'>('text');
  readonly autocomplete = input<string>('off');
  readonly isInvalid = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);
  readonly inputId = input<string>(`app-input-${Math.random().toString(36).substring(2, 9)}`);

  // State Internal
  readonly value = signal<string>('');
  readonly disabled = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);

  // Native Element Ref
  private readonly nativeInput = viewChild.required<ElementRef<HTMLInputElement>>('nativeInput');

  // CVA Callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  focus(): void {
    this.nativeInput().nativeElement.focus();
  }

  select(): void {
    this.nativeInput().nativeElement.select();
  }
}
