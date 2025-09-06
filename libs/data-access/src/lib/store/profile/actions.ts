import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Profile } from '@tt/data-access'

export const profileActions = createActionGroup({
	source: 'profile',
	events: {
		'filter events': props<{ filters: Record<string, any> }>(),
		'set page': props<{ page?: number }>(),
		'profiles loaded': props<{ profiles: Profile[] }>(),

		'subscribe to user': props<{ profileId: number }>(),
		'unsubscribe to user': props<{ profileId: number }>(),
		'load my subscriptions': emptyProps(),
		'save my subscriptions id': props<{ profilesId: number[] }>()
	}
})
