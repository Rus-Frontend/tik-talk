import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component, EventEmitter,
	forwardRef, inject,
	input, Output, signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule
} from '@angular/forms'

@Component({
	selector: 'tt-input',
	imports: [CommonModule, ReactiveFormsModule, FormsModule],
	templateUrl: './tt-input.component.html',
	styleUrl: './tt-input.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => TtInputComponent)
		}
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TtInputComponent implements ControlValueAccessor {
	type = input<'text' | 'password'>('text')
	placeholder = input<string>()

	disabled = signal<boolean>(false)

	@Output() isTouched = new EventEmitter()

	cdr = inject(ChangeDetectorRef)

	onChange: any
	onTouchedFn: any

	value: string | null = null

	writeValue(val: string | null) {
		this.value = val

		this.cdr.detectChanges()
	}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}

	registerOnTouched(fn: any): void {
		this.onTouchedFn = fn
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled.set(isDisabled)
	}

	onModelChange(val: string | null) {
		this.onChange(val)

		this.cdr.detectChanges()
	}

	onTouched() {
		this.onTouchedFn()
		this.isTouched.emit()
	}

}