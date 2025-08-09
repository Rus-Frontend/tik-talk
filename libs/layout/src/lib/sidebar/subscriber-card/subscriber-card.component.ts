import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ImgUrlPipe } from '@tt/common-ui';
import { Profile } from '@tt/data-access';

@Component({
  selector: 'app-subscriber-card',
  imports: [ImgUrlPipe],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriberCardComponent {
  @Input() profile!: Profile;
}
