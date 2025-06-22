import {Component, input} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {LastMessageRes} from "../../../data/interfaces/chats.interface";
import {LocalTimePipe} from "../../../helpers/pipes/local-time.pipe";
import {TimeFromPipe} from "../../../helpers/pipes/time-from.pipe";

@Component({
  selector: 'button[chats]',
  imports: [
    AvatarCircleComponent,
    LocalTimePipe,
    TimeFromPipe
  ],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>()
}
