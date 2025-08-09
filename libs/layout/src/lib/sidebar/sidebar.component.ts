import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	OnInit
} from '@angular/core'

import { AsyncPipe, NgForOf } from '@angular/common'
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { firstValueFrom, Subscription, timer } from 'rxjs'
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui'
import { ChatsService, ProfileService } from '@tt/data-access'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
	selector: 'app-sidebar',
	imports: [
		SvgIconComponent,
		NgForOf,
		SubscriberCardComponent,
		RouterLink,
		AsyncPipe,
		ImgUrlPipe,
		RouterLinkActive
	],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
	profileService = inject(ProfileService)
	#chatService = inject(ChatsService)
	destroyRef = inject(DestroyRef)

	subscribers$ = this.profileService.getSubscribersShortList()

	me = this.profileService.me

	unreadMessagesCount = this.#chatService.unreadMessages

	wsSubscribe!: Subscription

	menuItems = [
		{
			label: 'Моя страница',
			icon: 'home',
			link: 'profile/me'
		},
		{
			label: 'Чаты',
			icon: 'chat',
			link: 'chats'
		},
		{
			label: 'Поиск',
			icon: 'search',
			link: 'search'
		}
	]

	constructor() {
		this.connectWs()
	}

	async reconnect() {
		console.log('reconnecting...')
		await firstValueFrom(this.profileService.getMe())
		await firstValueFrom(timer(3000))
		this.connectWs()
	}

	connectWs() {
		this.wsSubscribe?.unsubscribe()
		this.wsSubscribe = this.#chatService
			.connectWs()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((message) => {
				if ('error' in message) {
					console.log('Неверный токен')
					this.reconnect()
				}
			})
	}

	ngOnInit() {
		firstValueFrom(this.profileService.getMe())
	}
}
