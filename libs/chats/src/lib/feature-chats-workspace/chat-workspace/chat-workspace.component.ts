import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component,
	inject
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import {
	filter,
	of,
	switchMap
} from 'rxjs'
import { AsyncPipe } from '@angular/common';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessagesWrapperComponent } from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component';
import { ChatsService } from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace',
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessagesWrapperComponent,
    AsyncPipe,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  chatsService = inject(ChatsService);
	cdr = inject(ChangeDetectorRef)

  activeChat$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'new') {
        return this.route.queryParams.pipe(
          filter(({ userId }) => userId),
          switchMap(({ userId }) => {
            return this.chatsService.createChat(userId).pipe(
              switchMap((chat) => {
                this.router.navigate(['chats', chat.id]);
                return of(null);
              })
            );
          })
        );
      }
      return this.chatsService.getChatById(id);
    })
  );

}
