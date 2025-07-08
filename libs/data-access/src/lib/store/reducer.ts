import { Profile } from '@tt/data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';

export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {}
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
		}))
  )
})
