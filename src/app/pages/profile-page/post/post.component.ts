import {Component, EventEmitter, inject, Input, input, OnInit, Output, signal} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {PostInputComponent} from "../post-input/post-input.component";
import {CommentComponent} from "./comment/comment.component";
import {PostService} from "../../../data/services/post.service";
import {firstValueFrom} from "rxjs";
import {Post, PostComment} from "../../../data/interfaces/post.interface";
import {TimeFromPipe} from "../../../helpers/pipes/time-from.pipe";
import {LocalTimePipe} from "../../../helpers/pipes/local-time.pipe";

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
  styleUrl: './post.component.scss'
})

export class PostComponent implements OnInit {
  post = input<Post>()

  comments = signal<PostComment[]>([])

  postService = inject(PostService)

  @Output() eventOnCreateComment = new EventEmitter<any[]>();

  postText = ''
  postId: number = 0

  onCreateComment(val: string) {
    this.postText = val;
    this.postId = this.post()!.id
    this.eventOnCreateComment.emit([this.postId, this.postText]);
  }

  async ngOnInit(): Promise<void> {
    this.comments.set(this.post()!.comments)
  }

  async onCreated(postId: number) {
    const comments = await firstValueFrom(this.postService.getCommentsByPostId(postId))
    this.comments.set(comments)
  }
}
