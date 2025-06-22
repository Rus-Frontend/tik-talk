import {Component, inject, signal} from '@angular/core';
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {DndDirective} from "../../../common-ui/directives/dnd.directive";
import {FormsModule} from "@angular/forms";
import {ProfileService} from "../../../data/services/profile.service";
import {ImgUrlPipe} from "../../../helpers/pipes/img-url.pipe";

@Component({
  selector: 'app-avatar-upload',
  imports: [
    SvgIconComponent,
    DndDirective,
    FormsModule,
    ImgUrlPipe
  ],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/imgs/avatar-placeholder.png')

  profileService = inject(ProfileService)

  profile = this.profileService.me

  avatar: File | null = null;

  fileBrowserHandler (event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0]
    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined): void {
    if (!file || !file.type.match('image')) return

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '')
    }

    reader.readAsDataURL(file);
    this.avatar = file
  }
}
