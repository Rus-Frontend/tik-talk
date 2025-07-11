import {
	Component,
	inject,
	input,
	OnInit,
	signal
} from '@angular/core'
import { CommentComponent, PostInputComponent } from '../../ui';
import {
  AvatarCircleComponent,
  LocalTimePipe,
  SvgIconComponent,
  TimeFromPipe,
} from '@tt/common-ui';
import {
	GlobalStoreService,
	Post, PostComment,
	PostService
} from '@tt/data-access'
import { Store } from '@ngrx/store'
import {
	postActions,
	selectComments,
} from '../../../../../data-access/src/lib/store/posts'
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimeFromPipe,
    LocalTimePipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
	postService = inject(PostService);
	store = inject(Store)

  post = input<Post>();

  comments = signal<PostComment[]>([]);

	profile = inject(GlobalStoreService).me;


	onCreateComment(commentText: string) {
		firstValueFrom(
			  this.postService.createComment({
			    text: commentText,
			    authorId: this.profile()!.id,
			    postId: this.post()!.id,
			  }))
			.then(async () => {
				this.store.dispatch(postActions.loadCreatedComment({postId: this.post()!.id}))

				setTimeout(() => {
					this.comments.set(this.store.selectSignal(selectComments)());
				}, 100);
			})
	}

  // onCreateComment(commentText: string) {
	// 	    firstValueFrom(
  //     this.postService.createComment({
  //       text: commentText,
  //       authorId: this.profile()!.id,
  //       postId: this.post()!.id,
  //     }))
	// 				.then(async () => {
  //     const comments = await firstValueFrom(
  //       this.postService.getCommentsByPostId(this.post()!.id)
  //     );
  //     this.comments.set(comments);
  //   });
  // }

  async ngOnInit(): Promise<void> {
    this.comments.set(this.post()!.comments)
  }

}
