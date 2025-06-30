import {AfterViewInit, Component, ElementRef, inject, OnDestroy, Renderer2} from '@angular/core';
import {ProfileCardComponent} from "../../common-ui/profile-card/profile-card.component";
import {ProfileService} from "../../data/services/profile.service";
import {Profile} from "../../data/interfaces/profile.interface";
import {ProfileFiltersComponent} from "./profile-filters/profile-filters.component";
import {debounceTime, fromEvent, Subscription} from "rxjs";

@Component({
  selector: 'app-search-page',
    imports: [
        ProfileCardComponent,
        ProfileFiltersComponent
    ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements AfterViewInit, OnDestroy {
  profileService = inject(ProfileService)

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  profiles = this.profileService.filteredProfiles

  resizing!: Subscription;

  constructor() {

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
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
