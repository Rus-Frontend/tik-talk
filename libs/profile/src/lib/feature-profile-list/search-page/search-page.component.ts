import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { selectFilteredProfiles } from '@tt/data-access'
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common'

@Component({
	selector: 'app-search-page',
	imports: [ProfileCardComponent, ProfileFiltersComponent, AsyncPipe],
	templateUrl: './search-page.component.html',
	styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements AfterViewInit, OnDestroy {
	store = inject(Store)

	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)

	profiles = this.store.selectSignal(selectFilteredProfiles)

	resizing!: Subscription

	constructor() {}

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
}
