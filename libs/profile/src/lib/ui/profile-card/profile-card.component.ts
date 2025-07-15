import {
	Component,
	EventEmitter,
	inject,
	input,
	Input, OnChanges, OnInit,
	Output, signal
} from '@angular/core'
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui'
import {
	Profile
} from '@tt/data-access'
import { Store } from '@ngrx/store'
import { Router } from '@angular/router'

@Component({
	selector: 'app-profile-card',
	standalone: true,
	imports: [ImgUrlPipe, SvgIconComponent],
	templateUrl: './profile-card.component.html',
	styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent implements OnInit, OnChanges {
	@Input() profile!: Profile
	mySubscriptions = input<number[]>([])
	router = inject(Router);

	isSubscribe = signal(false)

	@Output() eventOnSubscribe = new EventEmitter()
	@Output() eventOnUnsubscribe = new EventEmitter()

	store = inject(Store)

	ngOnInit() {
		this.isSubscribe.set(this.mySubscriptions().includes(this.profile.id))
		}

	onSubscribe() {
		this.eventOnSubscribe.emit(this.profile.id)
	}

	onUnsubscribe() {
		this.eventOnUnsubscribe.emit(this.profile.id)
	}

	async sendMessage(userId: number) {
		this.router.navigate(['/chats', 'new'], { queryParams: { userId } });
	}

	ngOnChanges() {
		this.isSubscribe.set(this.mySubscriptions().includes(this.profile.id))
	}

}
