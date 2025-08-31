import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	ViewChild
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui';
import { ProfileService } from '@tt/data-access';
import { AddressInputComponent, StackInputComponent } from '@tt/common-ui'

@Component({
	selector: 'app-settings-page',
	imports: [
		ProfileHeaderComponent,
		ReactiveFormsModule,
		AvatarUploadComponent,
		StackInputComponent,
		AddressInputComponent
	],
	templateUrl: './settings-page.component.html',
	styleUrl: './settings-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
	fb = inject(FormBuilder)
	profileService = inject(ProfileService)

	profile = this.profileService.me

	@ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent

	form = this.fb.group({
		firstName: ['', Validators.required],
		lastName: ['', Validators.required],
		username: [{ value: '', disabled: true }, Validators.required],
		description: [''],
		stack: [],
		// stack: [{value: '', disabled: true}]
		city: [null],
	})

	constructor() {
		effect(() => {
			//@ts-ignore
			this.form.patchValue({
				...this.profileService.me()
			})
		})
		console.log(this.profileService.me()?.city)
	}

	onSave() {
		console.log(this.profileService.me()?.city)

		this.form.markAsTouched()
		this.form.updateValueAndValidity()

		if (this.form.invalid) return

		if (this.avatarUploader.avatar) {
			firstValueFrom(
				this.profileService.uploadAvatar(this.avatarUploader.avatar)
			)
		}

		//@ts-ignore
		firstValueFrom(
			//@ts-ignore
			this.profileService.patchProfile({
				...this.form.value
			})
		)
	}
}
