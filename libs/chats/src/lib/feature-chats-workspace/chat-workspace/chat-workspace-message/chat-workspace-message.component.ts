import { Component, HostBinding, input } from '@angular/core';
import { AvatarCircleComponent, LocalTimePipe } from '@tt/common-ui';
import { Message } from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace-message',
  imports: [AvatarCircleComponent, LocalTimePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>();

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine;
  }
}
