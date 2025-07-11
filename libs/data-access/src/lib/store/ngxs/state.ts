import { Pageble, Profile, ProfileService } from '@tt/data-access'
import { inject, Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'
import { FilterEvents } from './actions'
import { Observable, tap } from 'rxjs'

export interface ProfileStateModel {
	profiles: Profile[],
	profileFilters: Record<string, any>
}

@State({
	name: 'profileState',
	defaults: {
		profiles: [],
		profileFilters: {}
	}
})
@Injectable()
export class ProfileState {
	#profileService = inject(ProfileService)

	@Selector()
	static getProfiles(state: ProfileStateModel): Profile[] {
		return state.profiles
	}

	@Action(FilterEvents)
	onFilterEvets(ctx: StateContext<ProfileStateModel>, {filters}: FilterEvents) {
		return this.#profileService.filterProfiles(filters).pipe(
			tap(res => {
				ctx.patchState({
					profiles: res.items
				})
			})
		)
		}
	}
