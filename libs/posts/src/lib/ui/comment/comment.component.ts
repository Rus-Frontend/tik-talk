import { Component, input } from '@angular/core';
import { AvatarCircleComponent, LocalTimePipe } from '@tt/common-ui';
import { PostComment } from '@tt/data-access';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, LocalTimePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
