import {Component, ElementRef, inject, input, Renderer2, ViewChild} from '@angular/core';
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

  @ViewChild(PostComponent) postComponent!: PostComponent;

  postText = '';
  postId:number = 0;
  resizing!: Subscription;

  constructor() {
    firstValueFrom(this.postService.fetchPosts())
  }

  onCreatePost(val: string): void {
    this.postText = val;

    if (!this.postText) return console.log("No post text found.");

    firstValueFrom(this.postService.createPost({
      title: 'Клёвый пост',
      content: this.postText,
      authorId: this.profile()!.id
    })).then(() => {
      this.postText = ''
    })
  }

  onCreateComment(data: any[]): void {
    this.postId = data[0];
    this.postText = data[1];

    if (!this.postText || !this.postId) return console.log("No comment text found.");

    firstValueFrom(this.postService.createComment({
      text: this.postText,
      authorId: this.profile()!.id,
      postId: this.postId,
    })).then(() => {
      this.postComponent.onCreated(this.postId).then()
      {
        this.postText = ''
        this.postId = 0
      }
    })
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
