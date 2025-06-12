import {Component, ElementRef, inject, input, Renderer2, signal} from '@angular/core';
import {ChatWorkspaceMessageComponent} from "./chat-workspace-message/chat-workspace-message.component";
import {MessageInputComponent} from "../../../../common-ui/message-input/message-input.component";
import {ChatsService} from "../../../../data/services/chats.service";
import {Chat, Message} from "../../../../data/interfaces/chats.interface";
import {debounceTime, firstValueFrom, fromEvent, Subscription} from "rxjs";
import {PostService} from "../../../../data/services/post.service";
import {ProfileService} from "../../../../data/services/profile.service";

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatWorkspaceMessageComponent,
    MessageInputComponent
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatService = inject(ChatsService)

  chat = input.required<Chat>()

  messages = this.chatService.activeChatMessages

  async onSendMessage(messageText:string) {
    await firstValueFrom(this.chatService.sendMessage(this.chat().id, messageText))

    await firstValueFrom(this.chatService.getChatById(this.chat().id))
  }





  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  resizing!: Subscription;

  ngAfterViewInit() {
    this.resizeFeed()

    this.resizing = fromEvent(window, 'resize')
        .pipe(debounceTime(50))
        .subscribe(() => {
          this.resizeFeed()
        })
  }

  ngOnDestroy() {
    this.resizing.unsubscribe()
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }


}
