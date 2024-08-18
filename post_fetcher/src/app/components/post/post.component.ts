import { Component, Input } from '@angular/core';
import { Post } from '../../../interfaces/post';
import { SessionStorageService } from '../../../services/session/session-storage.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [NgFor, NgIf, DatePipe],
	templateUrl: './post.component.html',
	styleUrl: './post.component.scss',
})
export class PostComponent {
	@Input() post!: Post;
	@Input() id!: number;

	constructor(private sessionStorageService: SessionStorageService) {}

	saveToStorage(event: Event) {
		const checkbox = event.target as HTMLInputElement;
		if (checkbox.checked) {
			this.sessionStorageService.updateSessionStorage(
				`post-${this.id}`,
				this.post
			);
		} else {
			this.sessionStorageService.removeSessionStorage(`post-${this.id}`);
		}
	}

	selectIfInStorage() {
		return !!sessionStorage.getItem(`post-${this.id}`);
	}
}
