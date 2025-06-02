import {Component, inject, input, OnInit, signal} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";
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
    DatePipe,
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

  async ngOnInit(): Promise<void> {
    this.comments.set(this.post()!.comments)
  }

  async onCreated() {
    const comments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id))

    this.comments.set(comments)
  }
}
