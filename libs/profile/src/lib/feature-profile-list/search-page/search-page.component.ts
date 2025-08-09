import {
	AfterViewInit, ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	OnDestroy,
	Renderer2
} from '@angular/core'
import { debounceTime, fromEvent, Subscription } from 'rxjs'
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import {
	profileActions,
	selectFilteredProfiles, selectMySubscription
} from '@tt/data-access'
import { Store } from '@ngrx/store';
import { InfiniteScrollTriggerComponent } from '@tt/common-ui'

@Component({
	selector: 'app-search-page',
	imports: [
		ProfileCardComponent,
		ProfileFiltersComponent,
		InfiniteScrollTriggerComponent
	],
	templateUrl: './search-page.component.html',
	styleUrl: './search-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements AfterViewInit, OnDestroy {
	store = inject(Store)

	// store = inject(profileStore) // - альтернативный вариант стора на signal ngrx

	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)

	profiles = this.store.selectSignal(selectFilteredProfiles)

	mySubscriptions = this.store.selectSignal(selectMySubscription)
	// mySubscriptions = signal<Profile[]>([])

	// profiles = this.store.profiles // - альтернативный вариант стора на signal ngrx
	// profiles = this.store.profiles2 // - альтернативный вариант стора на signal ngrx с доп. действием - замена фамилии профайлов на BLA BLA

	// profiles = this.store.selectSignal(ProfileState.getProfiles) // - альтернативный вариант стора на ngxs

	resizing!: Subscription

	constructor() {
		this.store.dispatch(profileActions.loadMySubscriptions())
	}

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
		const height = window.innerHeight - top - 24 - 24
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}

	onSubscribe(profileId: number) {
		this.store.dispatch(
			profileActions.subscribeToUser({ profileId: profileId })
		)
	}

	onUnsubscribe(profileId: number) {
		this.store.dispatch(
			profileActions.unsubscribeToUser({ profileId: profileId })
		)
	}

	timeToFetch() {
		this.store.dispatch(profileActions.setPage({}))
	}
}
