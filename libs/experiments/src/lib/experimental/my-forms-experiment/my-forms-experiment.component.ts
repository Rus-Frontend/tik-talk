import {
	AfterViewInit, ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	OnDestroy,
	Renderer2,
	signal
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MyMockService, Receiver } from './my-mock.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { MaskitoOptions } from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';
import { mask } from '@tt/common-ui';
import {
	CompaniesInputComponent
} from './companies-input/companies-input.component'
import { CompanyData } from './companies-input/interface/company-data'

@Component({
	selector: 'app-my-forms-experiment',
	imports: [ReactiveFormsModule, MaskitoDirective, CompaniesInputComponent],
	templateUrl: './my-forms-experiment.component.html',
	styleUrl: './my-forms-experiment.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyFormsExperimentComponent implements OnDestroy, AfterViewInit {
	myMockService = inject(MyMockService)

	paymentDate = signal('')

	isReceiverPerson = signal(false)

	resizing!: Subscription

	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)

	Receiver: Receiver[] = []

	paymentForm = new FormGroup({
		senderName: new FormControl<string>('', Validators.required),
		senderKPP: new FormControl<number | null>(null, Validators.required),
		receiverName: new FormControl<string>('', Validators.required),
		receiverINN: new FormControl<number | null>(null, [
			Validators.required,
			Validators.minLength(10),
			Validators.maxLength(10)
		]),
		receiverKPP: new FormControl<number | null>(null, [
			Validators.required,
			Validators.minLength(9),
			Validators.maxLength(9)
		]),
		receiverBIK: new FormControl<string>('', [
			Validators.required,
			Validators.minLength(9),
			Validators.maxLength(9)
		]),
		receiverBankAcc: new FormControl<string>('', [
			Validators.required,
			Validators.minLength(20),
			Validators.maxLength(20)
		]),
		receiverUIN_UIP: new FormControl<number | null>(null),
		senderBankAcc: new FormControl<string>('', Validators.required),
		sum: new FormControl<number | null>(null, Validators.required),
		purposePayment: new FormControl<string>('', Validators.required),
		paymentDate: new FormControl<string>('', Validators.required),
		senderTel: new FormControl<number | null>(null)
	})

	constructor() {
		this.myMockService
			.getMe()
			.pipe(takeUntilDestroyed())
			.subscribe((me) => {
				this.paymentForm.patchValue(me, { emitEvent: false })
				this.paymentForm.controls.senderBankAcc.patchValue(
					me.senderBankAcc + ` (${this.splitSum(me.senderBankAccSum)} руб.)`
				)
			})

		this.paymentForm.controls.receiverINN.valueChanges
			.pipe(takeUntilDestroyed())
			.subscribe((value) => {
				if (!this.isReceiverPerson() && value?.toString().length === 10) {
					this.myMockService
						.getReceiverByINN(value)
						?.pipe()
						.subscribe((receiver) => {
							this.Receiver = receiver
						})

					this.paymentForm.patchValue(this.Receiver[0], { emitEvent: false })
				}
			})

		this.getPaymentDate()

		this.paymentForm.controls.senderName.disable()
		this.paymentForm.controls.senderKPP.disable()
		this.paymentForm.controls.senderBankAcc.disable()
		this.paymentForm.controls.paymentDate.disable()
	}

	getPaymentDate() {
		this.paymentDate.set(DateTime.now().toFormat('dd.MM.yyyy'))
		this.paymentForm.controls.paymentDate.patchValue(this.paymentDate(), {
			emitEvent: false
		})
	}

	onSendPayment(event: SubmitEvent) {
		this.paymentForm.markAllAsTouched()
		this.paymentForm.updateValueAndValidity()

		if (this.paymentForm.valid) {
			this.getPaymentDate()

			console.log(this.paymentForm.value)

			this.controlsReset()
		}
	}

	controlsReset() {
		this.paymentForm.controls.purposePayment.reset()
		this.paymentForm.controls.sum.reset()
		this.paymentForm.controls.receiverBankAcc.reset()
		this.paymentForm.controls.receiverBIK.reset()
		this.paymentForm.controls.receiverUIN_UIP.reset()
		this.paymentForm.controls.receiverINN.reset()
		this.paymentForm.controls.receiverKPP.reset()
		this.paymentForm.controls.receiverName.reset()
	}

	isPerson() {
		this.isReceiverPerson.set(true)
		this.controlsReset()
		this.paymentForm.controls.receiverKPP.clearValidators()
	}

	isLegal() {
		this.isReceiverPerson.set(false)
		this.controlsReset()
		this.paymentForm.controls.receiverKPP.setValidators([Validators.required])
	}

	splitSum(value: number) {
		return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
	}

	ngAfterViewInit() {
		this.resizeFeed()

		this.resizing = fromEvent(window, 'resize')
			.pipe(debounceTime(50))
			.subscribe(() => {
				this.resizeFeed()
			})
	}

	ngOnDestroy() {
		this.resizing.unsubscribe()
	}

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()
		const height = window.innerHeight - top - 20
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}

	readonly maskitoOptions: MaskitoOptions = mask


	onFillCompanyData(companyData: CompanyData) {
		this.paymentForm.controls.receiverName.setValue(companyData.companyName)
		this.paymentForm.controls.receiverINN.setValue(companyData.companyInn)
		this.paymentForm.controls.receiverKPP.setValue(companyData.companyKpp)
	}

}
