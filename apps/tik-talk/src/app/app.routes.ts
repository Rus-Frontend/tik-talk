import { Routes } from '@angular/router';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { ProfilePageComponent, SearchPageComponent, SettingsPageComponent } from '@tt/profile';
import { ChatsRoutes } from '@tt/chats';
import { FormsExperimentComponent, MyFormsExperimentComponent } from '@tt/experiments';
import { LayoutComponent } from '@tt/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'search', component: SearchPageComponent },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'experiment', component: FormsExperimentComponent },
      { path: 'my-experiment', component: MyFormsExperimentComponent },
      {
        path: 'chats',
        loadChildren: () => ChatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
];
