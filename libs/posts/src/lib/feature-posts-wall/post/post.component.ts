import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
} from '@angular/core'
import { CommentComponent, PostInputComponent } from '../../ui'
import {
	AvatarCircleComponent,
	LocalTimePipe,
	SvgIconComponent,
	TimeFromPipe
} from '@tt/common-ui'
import {
	GlobalStoreService,
	Post,
	PostService
} from '@tt/data-access'
import { Store } from '@ngrx/store'
import { postActions } from '../../../../../data-access/src/lib/store/posts'
import { firstValueFrom } from 'rxjs'

@Component({
	selector: 'app-post',
	imports: [
		AvatarCircleComponent,
		SvgIconComponent,
		PostInputComponent,
		CommentComponent,
		TimeFromPipe,
		LocalTimePipe
	],
	templateUrl: './post.component.html',
	styleUrl: './post.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent {
	postService = inject(PostService)
	store = inject(Store)

	post = input<Post>()

	// comments = signal<PostComment[]>([]);

	profile = inject(GlobalStoreService).me

	onCreateComment(commentText: string) {
		firstValueFrom(
			this.postService.createComment({
				text: commentText,
				authorId: this.profile()!.id,
				postId: this.post()!.id
			})
		).then(() => {
			this.store.dispatch(postActions.loadPosts())

			// - Мой вариант с получением комментариев по postId. Недостаток в том что комменты приходят асинхронно и приходится делать setTimeout.
			// В других файлах стора закомментированные строки к этому же. В шаблоне, где выводятся комменты переделан вывод из постов, а не с сигнала comments в компоненте.

			// this.store.dispatch(postActions.loadCreatedComment({postId: this.post()!.id}))

			// 	setTimeout(() => {
			// 		this.comments.set(this.store.selectSignal(selectComments)());
			// 	}, 100);
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

	// async ngOnInit(): Promise<void> {
	//   this.comments.set(this.post()!.comments)
	// }
}
