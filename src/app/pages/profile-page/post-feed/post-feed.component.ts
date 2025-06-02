import {Component, ElementRef, HostListener, inject, Renderer2} from '@angular/core';
import {PostInputComponent} from "../post-input/post-input.component";
import {PostComponent} from "../post/post.component";
import {PostService} from "../../../data/services/post.service";
import {debounceTime, firstValueFrom, fromEvent, Subscription} from "rxjs";

@Component({
  selector: 'app-post-feed',
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  feed = this.postService.posts;

  resizing!: Subscription;

  // @HostListener('window:resize')
  // onWindowResize(): void {
  //   this.resizeFeed()
  // }

  constructor() {
    firstValueFrom(this.postService.fetchPosts())
  }

  ngAfterViewInit() {
    this.resizeFeed()

    this.resizing = fromEvent(window, 'resize')
        .pipe(
            debounceTime(50)
        )
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
