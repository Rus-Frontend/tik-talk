import {
	AfterViewInit,
	Component,
	ElementRef,
	inject,
	OnDestroy,
	Renderer2
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
	debounceTime,
	fromEvent,
	map,
	startWith,
	Subscription,
	switchMap
} from 'rxjs'
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { ChatsService } from '@tt/data-access';

@Component({
	selector: 'app-chats-page-list',
	imports: [
		ChatsBtnComponent,
		ReactiveFormsModule,
		AsyncPipe,
		RouterLink,
		RouterLinkActive
	],
	templateUrl: './chats-list.component.html',
	styleUrl: './chats-list.component.scss'
})
export class ChatsListComponent implements AfterViewInit, OnDestroy {
	chatsService = inject(ChatsService)

	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)

	resizing!: Subscription

	filterChatsControl = new FormControl('')

	chats$ = this.chatsService.getMyChats().pipe(
		switchMap((chats) => {
			return this.filterChatsControl.valueChanges.pipe(
				startWith(''),
				map((inputValue) => {
					return chats.filter((chat) => {
						return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
							.toLowerCase()
							.includes(inputValue!.toLowerCase() ?? '')
					})
				})
			)
		})
	)



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
		const height = window.innerHeight - top - 26
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}
}
