import {Component, ElementRef, inject, Renderer2} from '@angular/core';
import {PostInputComponent} from "../post-input/post-input.component";
import {PostComponent} from "../post/post.component";
import {PostService} from "../../../data/services/post.service";
import {debounceTime, firstValueFrom, fromEvent, Subscription} from "rxjs";
import {ProfileService} from "../../../data/services/profile.service";

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

  profile = inject(ProfileService).me;

  resizing!: Subscription;

  constructor() {
    firstValueFrom(this.postService.fetchPosts())
  }

  onCreatePost(postText: string): void {
    if (!postText) return console.log("No post text found.");

    firstValueFrom(this.postService.createPost({
      title: 'Клёвый пост',
      content: postText,
      authorId: this.profile()!.id
    }))
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
