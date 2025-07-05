import { Component, input } from '@angular/core';
import { AvatarCircleComponent, TimeFromPipe } from '@tt/common-ui';
import { LastMessageRes } from '@tt/data-access';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, TimeFromPipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>();
}
