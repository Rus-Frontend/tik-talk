import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommentComponent, PostInputComponent } from '../../ui';
import {
  AvatarCircleComponent,
  LocalTimePipe,
  SvgIconComponent,
  TimeFromPipe,
} from '@tt/common-ui';
import {
  GlobalStoreService,
  Post,
  PostComment,
  PostService,
} from '@tt/data-access';

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
  post = input<Post>();

  comments = signal<PostComment[]>([]);

  profile = inject(GlobalStoreService).me;

  postService = inject(PostService);

  onCreateComment(commentText: string) {
    firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: this.profile()!.id,
        postId: this.post()!.id,
      })
    ).then(async () => {
      const comments = await firstValueFrom(
        this.postService.getCommentsByPostId(this.post()!.id)
      );
      this.comments.set(comments);
    });
  }

  async ngOnInit(): Promise<void> {
    this.comments.set(this.post()!.comments);
  }
}
