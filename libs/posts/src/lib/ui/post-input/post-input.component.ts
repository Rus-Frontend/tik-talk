import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	inject,
	input,
	Output,
	Renderer2
} from '@angular/core'
import { NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui'
import { GlobalStoreService } from '@tt/data-access'

@Component({
	selector: 'app-post-input',
	imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
	templateUrl: './post-input.component.html',
	styleUrl: './post-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostInputComponent {
	r2 = inject(Renderer2)
	isCommentInput = input(false)
	profile = inject(GlobalStoreService).me

	@Output() eventOnCreatePost = new EventEmitter()
	@Output() eventOnCreateComment = new EventEmitter()

	@HostBinding('class.comment')
	get isComment() {
		return this.isCommentInput()
	}

	postText: string = ''
	textAreaHeight = ''

	onTextAreaInput(event: Event) {
		const textarea = event.target as HTMLTextAreaElement
		this.r2.setStyle(textarea, 'height', 'auto')
		this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px')
		this.postText = textarea.value.trim()
	}

	activeBtnCreatePost(): void {
		if (!this.isCommentInput()) {
			this.eventOnCreatePost.emit(this.postText)
		}

		if (this.isCommentInput()) {
			this.eventOnCreateComment.emit(this.postText)
		}

		this.postText = ''
		this.textAreaHeight = 'height: auto'
	}
}
