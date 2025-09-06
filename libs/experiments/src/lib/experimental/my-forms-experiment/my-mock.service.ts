import { Injectable } from '@angular/core'
import { of } from 'rxjs'

export interface Me {
	senderName: string
	senderKPP: number | null
	senderBankAcc: string
	senderBankAccSum: number | null
}

export interface Receiver {
	receiverName: string
	receiverINN: number
	receiverKPP: number
	receiverBIK: string
	receiverBankAcc: string
	receiverUIN_UIP: null
}

@Injectable({
	providedIn: 'root'
})
export class MyMockService {
	constructor() {}

	getMe() {
		return of({
			senderName: 'ООО "НТЦ "ПУЛЬС"',
			senderKPP: 781001001,
			senderBankAcc: '**2355',
			senderBankAccSum: 50000
		})
	}

	getReceiverByINN(inn: number) {
		if (Number(inn) === 1234567899) {
			return of([
				{
					receiverName: 'ООО "Рога и копыта"',
					receiverINN: 1234567899,
					receiverKPP: 781001001,
					receiverBIK: '044525225',
					receiverBankAcc: '40702810338260012196',
					receiverUIN_UIP: null
				}
			])
		} else return null
	}
}
