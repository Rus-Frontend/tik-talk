import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal
} from '@angular/core'
import { FormsModule } from '@angular/forms';
import { DndDirective, ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { ProfileService } from '@tt/data-access';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIconComponent, DndDirective, FormsModule, ImgUrlPipe],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/imgs/avatar-placeholder.png');

  profileService = inject(ProfileService);

  profile = this.profileService.me;

  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined): void {
    if (!file || !file.type.match('image')) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };

    reader.readAsDataURL(file);
    this.avatar = file;
  }
}
