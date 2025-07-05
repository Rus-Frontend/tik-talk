import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common-ui';
import { Profile } from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace-header',
  imports: [AvatarCircleComponent],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss',
})
export class ChatWorkspaceHeaderComponent {
  profile = input.required<Profile>();
}
