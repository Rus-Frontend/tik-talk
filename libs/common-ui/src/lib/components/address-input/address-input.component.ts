import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component,
	forwardRef,
	inject, signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
	ControlValueAccessor,
	FormControl, FormGroup,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule, Validators
} from '@angular/forms'
import { DadataService } from '../../data'
import { debounceTime, switchMap, tap } from 'rxjs'
import { TtInputComponent } from '../tt-input/tt-input.component'
import { DadataSuggestion } from '../../data/interfaces/dadata.interface'

@Component({
	selector: 'tt-address-input',
	imports: [CommonModule, TtInputComponent, ReactiveFormsModule],
	templateUrl: './address-input.component.html',
	styleUrl: './address-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => AddressInputComponent)
		}
	]
})
export class AddressInputComponent implements ControlValueAccessor {
	// innerSearchControl = new FormControl()
	// #dadataService = inject(DadataService)
	// cdr = inject(ChangeDetectorRef)
	//
	// isDropdownOpened = signal<boolean>(true)
	//
	// suggestions$ = this.innerSearchControl.valueChanges.
	// pipe(
	// 	debounceTime(500),
	// 	switchMap(val => {
	// 		return this.#dadataService.getSuggestion(val)
	// 			.pipe(
	// 				tap(res => {
	// 					this.isDropdownOpened.set(!!res.length)
	// 				})
	// 			)
	// 	}))
	//
	// writeValue(city: string | null): void {
	// 	this.innerSearchControl.patchValue(city, {
	// 		emitEvent: false
	// 	})
	// }
	//
	// setDisabledState?(isDisabled: boolean): void {}
	//
	// registerOnChange(fn: any): void {
	// 	this.onChange = fn
	// }
	//
	// registerOnTouched(fn: any): void {
	// 	this.onTouched = fn
	// }
	//
	// onChange(value: any) {}
	//
	// onTouched() {}
	//
	// onSuggestionPick(city: string) {
	// 	this.innerSearchControl.patchValue(city, {
	// 		emitEvent: false
	// 	})
	//
	// 	this.isDropdownOpened.set(false)
	//
	// 	this.onChange(city)
	//
	// this.cdr.detectChanges()
	// }





	// Дополнение к форме с адресом
	innerSearchControl = new FormControl()
	#dadataService = inject(DadataService)
	cdr = inject(ChangeDetectorRef)

	isDropdownOpened = signal<boolean>(true)

	adressForm = new FormGroup({
		city: new FormControl('', Validators.required),
		street: new FormControl('', Validators.required),
		building: new FormControl('', Validators.required)
	})

	suggestions$ = this.innerSearchControl.valueChanges.
	pipe(
		debounceTime(500),
		switchMap(val => {
			return this.#dadataService.getSuggestion(val)
				.pipe(
					tap(res => {
						this.isDropdownOpened.set(!!res.length)
					})
				)
		}))

	writeValue(city: string | null): void {
		this.innerSearchControl.patchValue(city, {
			emitEvent: false
		})

		this.cdr.detectChanges()
	}

	setDisabledState?(isDisabled: boolean): void {}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn
	}

	onChange(value: any) {}

	onTouched() {}

	onSuggestionPick(suggest: DadataSuggestion) {

		this.isDropdownOpened.set(false)

		this.innerSearchControl.patchValue(
			`${suggest.data.city_type}.${suggest.data.city}, ` +
			`${suggest.data.street_type}.${suggest.data.street}, ` +
			`${suggest.data.house_type}.${suggest.data.house}`
	, {
			emitEvent: false
		})
		// this.onChange(suggest.data.city)

		this.adressForm.patchValue({
			city:`${suggest.data.city_type}.${suggest.data.city}` ,
			street: `${suggest.data.street_type}.${suggest.data.street}` ,
			building: `${suggest.data.house_type}.${suggest.data.house}`
		}, {
			emitEvent: false
		})

		this.onChange(this.adressForm.value)
		this.onChange(this.innerSearchControl.value)
		this.cdr.detectChanges()
	}

}
