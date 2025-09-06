import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Post, PostCreateDto } from '@tt/data-access'

export const postActions = createActionGroup({
	source: 'post',
	events: {
		'create post': props<PostCreateDto>(),
		'load posts': emptyProps(),
		'load created posts': props<{ posts: Post[] }>()

		// 'load created comment': props<{postId: number}>(),
		// 'load comments': props<{comments: PostComment[]}>(),
	}
})
