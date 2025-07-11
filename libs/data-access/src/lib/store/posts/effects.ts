import { inject, Injectable } from '@angular/core';
import { PostService } from '@tt/data-access'
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { postActions } from './actions'
import { map, switchMap } from 'rxjs';

@Injectable ({
  providedIn: 'root'
})

export class PostEffects {
  postService = inject(PostService)
  actions$ = inject(Actions)


	loadPosts = createEffect(() => {
		return this.actions$.pipe(
			ofType(postActions.loadPosts),
			switchMap(() => {
				return this.postService.fetchPosts()
			}),
			map((res) => postActions.loadCreatedPosts({posts: res}))
		)
	})

	createPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.createPost),
      switchMap((payload) => {
				return this.postService.createPost(payload)
      }),
      map((res) => postActions.loadCreatedPosts({posts: res}))
    )
  })

	loadComment = createEffect(() => {
		return this.actions$.pipe(
			ofType(postActions.loadCreatedComment),
			switchMap((payload) => {
				return this.postService.getCommentsByPostId(payload.postId)
			}),
			map((res) => postActions.loadComments({comments: res}))
		)
	})

}