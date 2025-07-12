import { Post, PostComment} from '@tt/data-access'
import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions} from './actions'

export interface PostState {
  posts: Post[],
  // comments: PostComment[]
}

export const initialState: PostState = {
	posts: [],
	// comments: []
}

export const postFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(

    initialState,

    on(postActions.loadCreatedPosts, (state, payload) => ({
      ...state,
			posts: payload.posts,
    })),

		// on(postActions.loadComments, (state, payload) => ({
		// 	...state,
		// 	comments: payload.comments
		// }))
  )
})
