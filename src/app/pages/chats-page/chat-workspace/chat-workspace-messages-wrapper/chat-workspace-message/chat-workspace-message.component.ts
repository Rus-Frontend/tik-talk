import {Component, HostBinding, input} from '@angular/core';
import {Message} from "../../../../../data/interfaces/chats.interface";
import {AvatarCircleComponent} from "../../../../../common-ui/avatar-circle/avatar-circle.component";
import {DatePipe} from "@angular/common";
import {LocalTimePipe} from "../../../../../helpers/pipes/local-time.pipe";

@Component({
  selector: 'app-chat-workspace-message',
  imports: [
    AvatarCircleComponent,
    LocalTimePipe
  ],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss'
})
export class ChatWorkspaceMessageComponent {
  message =  input.required<Message>()

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine
  }
}
