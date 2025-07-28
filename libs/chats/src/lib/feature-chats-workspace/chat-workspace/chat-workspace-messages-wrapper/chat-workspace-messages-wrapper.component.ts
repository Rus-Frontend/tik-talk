import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from '../chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../ui';
import {
  debounceTime,
  firstValueFrom,
  fromEvent,
  Subscription,
  timer,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimeFromPipe } from '@tt/common-ui';
import { Chat, ChatsService } from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent, TimeFromPipe],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent
  implements OnDestroy, AfterViewInit, AfterViewChecked
{
  chatService = inject(ChatsService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  resizing!: Subscription;

  @ViewChild('messagesWrapper') messageWrapper!: ElementRef;

  chat = input.required<Chat>();

  messages = this.chatService.activeChatMessages;

  constructor() {
    this.updateChat();
  }

  async onSendMessage(messageText: string) {
		this.chatService.wsAdapter.sendMessage(
			messageText,
			this.chat().id
		)

		// - старая вариант решения отправки сообщений
    // await firstValueFrom(
    //   this.chatService.sendMessage(this.chat().id, messageText)
    // );
    // await firstValueFrom(this.chatService.getChatById(this.chat().id));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngAfterViewInit() {
    this.resizeFeed();

    this.resizing = fromEvent(window, 'resize')
      .pipe(debounceTime(30))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  ngOnDestroy() {
    this.resizing.unsubscribe();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 130;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  scrollToBottom() {
    this.messageWrapper.nativeElement.scrollTop =
      this.messageWrapper.nativeElement.scrollHeight;
  }

  updateChat() {
    timer(50000, 50000)
      .pipe(takeUntilDestroyed())
      .subscribe(async () => {
        await firstValueFrom(this.chatService.getChatById(this.chat().id));
      });
  }
}
