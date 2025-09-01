import {
	ChangeDetectionStrategy,
	Component,
	effect, ElementRef, HostListener,
	inject, Renderer2,
	ViewChild
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, firstValueFrom, fromEvent, Subscription } from 'rxjs'
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

	@HostListener('click', ['$event'])
	onClick(event: MouseEvent) {
		event.stopPropagation()
		event.preventDefault()
	}


	// Ресайз:
	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)
	resizing!: Subscription


	ngAfterViewInit() {
		this.resizeFeed()

		this.resizing = fromEvent(window, 'resize')
			.pipe(debounceTime(50))
			.subscribe(() => {
				this.resizeFeed()
			})
	}

	ngOnDestroy() {
		this.resizing.unsubscribe()
	}

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()
		const height = window.innerHeight - top - 24
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}
}
