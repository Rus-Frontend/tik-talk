import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import {
	debounceTime,
	fromEvent,
	Subscription
} from 'rxjs'
import { PostComponent } from '../post/post.component';
import { PostInputComponent } from '../../ui';
import { GlobalStoreService, PostService } from '@tt/data-access';
import { Store } from '@ngrx/store'
import {
	postActions,
	selectPosts
} from '../../../../../data-access/src/lib/store/posts'

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements OnDestroy, AfterViewInit {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
	store = inject(Store)

	feed = this.store.selectSignal(selectPosts)

  profile = inject(GlobalStoreService).me;

  resizing!: Subscription;

  constructor() {
		this.store.dispatch(postActions.loadPosts())
		}

  onCreatePost(postText: string): void {
		if (!postText) return

		this.store.dispatch(postActions.createPost({
			title: 'Клёвый пост',
			content: postText,
			authorId: this.profile()!.id,
		}))

    // firstValueFrom(
    //   this.postService.createPost({
    //     title: 'Клёвый пост',
    //     content: postText,
    //     authorId: this.profile()!.id,
    //   })
    // );
  }

  ngAfterViewInit() {
    this.resizeFeed();

    this.resizing = fromEvent(window, 'resize')
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  ngOnDestroy() {
    this.resizing.unsubscribe();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
