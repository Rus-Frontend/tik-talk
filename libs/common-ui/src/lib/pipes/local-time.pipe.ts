import { Pipe, PipeTransform } from '@angular/core'
import { DateTime } from 'luxon'

@Pipe({
	name: 'localTime'
})
export class LocalTimePipe implements PipeTransform {
	transform(value: string | null, format?: string | null): string | null {
		if (!value) return null

		const now = DateTime.now()
		const offset = now.offset

		let exitFormat: string | null = ''

		if (!format) {
			exitFormat = 'HH:mm dd.MM.yyyy'
		} else {
			exitFormat = format
		}

		return DateTime.fromISO(value!)
			.plus({ minutes: offset })
			.toFormat(exitFormat)
			.toString()
	}
}
