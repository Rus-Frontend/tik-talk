import { inject, Injectable } from '@angular/core';
import { ProfileService } from '@tt/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import { map, switchMap } from 'rxjs';

@Injectable ({
  providedIn: 'root'
})

export class ProfileEffects {
  profileService = inject(ProfileService)
  actions$ = inject(Actions)

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({filters}) => {
				return this.profileService.filterProfiles(filters)
      }),
      map((res) => profileActions.profilesLoaded({profiles: res.items}))
    )
  })

	subscribeToUser = createEffect(() => {
		return this.actions$.pipe(
			ofType(profileActions.subscribeToUser),
			switchMap(({profileId}) => {
				return this.profileService.subscribeToUser(profileId)
			}),
			map(() => profileActions.loadMySubscriptions())
		)
	})

	loadMySubscriptions = createEffect(() => {
		return this.actions$.pipe(
			ofType(profileActions.loadMySubscriptions),
			switchMap(() => {
				return this.profileService.getMySubscriptions()
			}),
			map((res) => profileActions.saveMySubscriptionsId({
				profilesId: res.items.map((profile) => {return profile.id})}))
		)
	})

	unsubscribeToUser = createEffect(() => {
		return this.actions$.pipe(
			ofType(profileActions.unsubscribeToUser),
			switchMap(({profileId}) => {
				return this.profileService.unsubscribeToUser(profileId)
			}),
			map(() => profileActions.loadMySubscriptions())
		)
	})

}