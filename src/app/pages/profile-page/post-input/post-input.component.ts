import {Component, EventEmitter, HostBinding, inject, Input, input, Output, Renderer2} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {ProfileService} from "../../../data/services/profile.service";
import {NgIf} from "@angular/common";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-post-input',
  imports: [
    AvatarCircleComponent,
    NgIf,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})

export class PostInputComponent {
  r2 = inject(Renderer2);
  isCommentInput = input(false);
  profile = inject(ProfileService).me;

  @Output() eventOnCreatePost = new EventEmitter();
  @Output() eventOnCreateComment = new EventEmitter();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  postText: string = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
    this.postText = textarea.value;
  }

  activeBtnCreatePost(): void {
    if (!this.isCommentInput()) {
    this.eventOnCreatePost.emit(this.postText);
    }

    if (this.isCommentInput()) {
      this.eventOnCreateComment.emit(this.postText);
    }

    this.postText = '';
  }
}