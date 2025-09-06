import { Routes } from '@angular/router'
import { canActivateAuth, LoginPageComponent } from '@tt/auth'
import {
	ProfilePageComponent,
	SearchPageComponent,
	SettingsPageComponent
} from '@tt/profile'
import { ChatsRoutes } from '@tt/chats'
import {
	FormsExperimentComponent,
	MyFormsExperimentComponent
} from '@tt/experiments'
import { LayoutComponent } from '@tt/layout'
import { provideState } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { ProfileEffects, profileFeature } from '@tt/data-access'
import {
	PostEffects,
	postFeature
} from '../../../../libs/data-access/src/lib/store/posts'

export const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: '', redirectTo: 'profile/me', pathMatch: 'full' },
			{
				path: 'profile/:id',
				component: ProfilePageComponent,
				providers: [provideState(postFeature), provideEffects(PostEffects)]
			},
			{
				path: 'search',
				component: SearchPageComponent,
				providers: [
					// profileStore,
					// provideStates([ProfileState]) //-альтернативный вариант стора на ngxs
					provideState(profileFeature),
					provideEffects(ProfileEffects)
				]
			},
			{ path: 'settings', component: SettingsPageComponent },
			{ path: 'experiment', component: FormsExperimentComponent },
			{ path: 'my-experiment', component: MyFormsExperimentComponent },
			{
				path: 'chats',
				loadChildren: () => ChatsRoutes
			}
		],
		canActivate: [canActivateAuth]
	},
	{ path: 'login', component: LoginPageComponent }
]
