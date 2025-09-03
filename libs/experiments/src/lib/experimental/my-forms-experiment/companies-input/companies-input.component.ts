import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component, EventEmitter,
	forwardRef,
	inject, Output, signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { TtInputComponent } from '@tt/common-ui'
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule
} from '@angular/forms'
import { DadataService } from '../../../../../../common-ui/src/lib/data'
import { debounceTime, switchMap, tap } from 'rxjs'
import {
	DadataCompaniesSuggestion
} from '../../../../../../common-ui/src/lib/data/interfaces/dadata.interface'
import { CompanyData } from './interface/company-data'

@Component({
	selector: 'tt-companies-input',
	imports: [CommonModule, TtInputComponent, ReactiveFormsModule],
	templateUrl: './companies-input.component.html',
	styleUrl: './companies-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => CompaniesInputComponent)
		}
	]
})
export class CompaniesInputComponent implements ControlValueAccessor {
	dadataService = inject(DadataService)
	innerSearchControl = new FormControl()
	cdr = inject(ChangeDetectorRef)

	@Output() pickedCompany = new EventEmitter<CompanyData>()

	isDropdownOpened = signal<boolean>(false)

	companyData = signal<CompanyData>({
		companyName: '',
		companyInn: null,
		companyKpp: null
	})

	suggestions$ = this.innerSearchControl.valueChanges.pipe(
		debounceTime(500),
		switchMap((val) => {
			return this.dadataService.getCompaniesSuggestion(val).pipe(
				tap((res) => {
					this.isDropdownOpened.set(!!res.length)
				})
			)
		})
	)

	writeValue(companyName: any): void {
		this.innerSearchControl.patchValue(companyName,
			{
				emitEvent: false
			})
	}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn
	}

	setDisabledState?(isDisabled: boolean): void {

	}

	onChange(value: any) {}

	onTouched() {
		console.log('onTouched')
		this.isDropdownOpened.set(false)
	}

	onSuggestionPick(suggest: DadataCompaniesSuggestion) {
		this.isDropdownOpened.set(false)

		this.innerSearchControl.patchValue(
			suggest.data.name.short_with_opf, {
				emitEvent: false
			}
		)

		this.companyData.set({
			companyName: suggest.data.name.short_with_opf,
			companyInn: suggest.data.inn,
			companyKpp: suggest.data.kpp
		})

		this.pickedCompany.emit(this.companyData())

		this.onChange(this.innerSearchControl.value)

		this.cdr.detectChanges()
	}

}
