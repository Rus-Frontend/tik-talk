import {
	patchState,
	signalStore,
	withComputed, withHooks,
	withMethods,
	withState
} from '@ngrx/signals'
import { Profile, ProfileService } from '@tt/data-access'
import { computed, inject } from '@angular/core'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { pipe, switchMap, tap } from 'rxjs'

export interface ProfileStateModel {
	profiles: Profile[],
	profileFilters: Record<string, any>
}

const initialState: ProfileStateModel = {
	profiles: [],
	profileFilters: {}
}

export const profileStore = signalStore(
	withState(initialState),
	withComputed(({profiles}) => { // - доп. действие для примера - замена фамилии профайлов на BLA BLA
		return {
			profiles2: computed(() => profiles().map(profile => ({...profile, lastName: 'BLA_BLA'})))
		}
	}),
	withMethods((state, profileService = inject(ProfileService)) => {
		const filterProfiles = rxMethod<Record<string, any>>(
			pipe(
				switchMap(filters => {
					return profileService.filterProfiles(filters)
						.pipe(
							tap(res => patchState(state, {profiles: res.items}))
						)
				})
			)
		)
		return {
			filterProfiles
		}
	}),
	withHooks({ // - доп. действия которые можно выполнить автоматом при каких-то событиях
		onInit(store) {
			store.filterProfiles({})
		}
	})
)