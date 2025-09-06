import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'
import {
	DadataAddressSuggestion,
	DadataCompaniesSuggestion
} from '../interfaces/dadata.interface'
import { DADATA_COMPANIES_TOKEN } from './dadata_companies_token'
import { DADATA_ADDRESS_TOKEN } from './dadata_address_token'

@Injectable({
	providedIn: 'root'
})
export class DadataService {
	// Альтернатива/Дополнение к форме с адресом
	#apiUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/'
	#http = inject(HttpClient)

	getSuggestion(query: string) {
		return this.#http
			.post<{
				suggestions: DadataAddressSuggestion[]
			}>(
				`${this.#apiUrl}address`,
				{ query },
				{
					headers: {
						Authorization: `Token ${DADATA_ADDRESS_TOKEN}`
					}
				}
			)
			.pipe(
				map((res) => {
					return res.suggestions
				})
			)
	}

	getCompaniesSuggestion(query: string) {
		return this.#http
			.post<{
				suggestions: DadataCompaniesSuggestion[]
			}>(
				`${this.#apiUrl}party`,
				{ query },
				{
					headers: {
						Authorization: `Token ${DADATA_COMPANIES_TOKEN}`
					}
				}
			)
			.pipe(
				map((res) => {
					return res.suggestions
				})
			)
	}
}
