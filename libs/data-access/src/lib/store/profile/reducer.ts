import { Profile } from '@tt/data-access'
import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';

export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>,

	mySubscribtionsId: number[]
}

export const initialState: ProfileState = {
	profiles: [],
	profileFilters: {},

	mySubscribtionsId: []
}

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(

    initialState,

    on(profileActions.profilesLoaded, (state, payload) => ({
      ...state,
      profiles: payload.profiles,
    })),

		on(profileActions.filterEvents, (state, payload) => ({
			...state,
			profileFilters: payload.filters
		})),

		on(profileActions.saveMySubscriptionsId, (state, payload) => ({
			...state,
			mySubscribtionsId: payload.profilesId
		})),

  )
})
