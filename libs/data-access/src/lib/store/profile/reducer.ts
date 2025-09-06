import { Profile } from '@tt/data-access'
import { createFeature, createReducer, on } from '@ngrx/store'
import { profileActions } from './actions'

export interface ProfileState {
	profiles: Profile[]
	profileFilters: Record<string, any>
	page: number
	size: number

	mySubscribtionsId: number[]
}

export const initialState: ProfileState = {
	profiles: [],
	profileFilters: {},
	page: 1,
	size: 10,

	mySubscribtionsId: []
}

export const profileFeature = createFeature({
	name: 'profileFeature',
	reducer: createReducer(
		initialState,

		on(profileActions.profilesLoaded, (state, payload) => ({
			...state,
			profiles: state.profiles.concat(payload.profiles)
		})),

		on(profileActions.setPage, (state, payload) => {
			let page = payload.page

			if (!page) page = state.page + 1

			return {
				...state,
				page
			}
		}),

		on(profileActions.filterEvents, (state, payload) => ({
			...state,
			profiles: [],
			profileFilters: payload.filters,
			page: 1
		})),

		on(profileActions.saveMySubscriptionsId, (state, payload) => ({
			...state,
			mySubscribtionsId: payload.profilesId
		}))
	)
})
