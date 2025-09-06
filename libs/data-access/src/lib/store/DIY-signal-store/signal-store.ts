// - пример самописного небольшого сигнал стора. Не подключал его к проекту.

import { computed, Signal, signal } from '@angular/core'

export class SignalStoreService<T> {
	readonly state = signal({} as T)

	select<K extends keyof T>(key: K): Signal<T[K]> {
		return computed(() => this.state()[key])
	}

	set<K extends keyof T>(key: K, data: T[K]) {
		this.state.update((currentValue) => ({ ...currentValue, [key]: data }))
	}

	patchState(partialState: Partial<T>) {
		this.state.update((currentValue) => ({ ...currentValue, ...partialState }))
	}
}
