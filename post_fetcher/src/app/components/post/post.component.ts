import { Component, Input } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';

import { Post } from '../../../interfaces/post';
import { SessionStorageService } from '../../../services/session/session-storage.service';

@Component({
	selector: 'app-post',
	standalone: true,
	imports: [NgFor, NgIf, DatePipe],
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.scss'],
})
export class PostComponent {
	@Input() post!: Post;
	@Input() id!: number;

	// Array to keep track of which comments are checked
	checkedComments: boolean[] = [];

	constructor(private sessionStorageService: SessionStorageService) {}

	ngOnInit() {
		this.initializeCheckedComments();
	}

	// Initialize comment checkboxes based on the session storage
	initializeCheckedComments() {
		const storedPost = this.getStoredPost();
		const comments = this.post.comments ?? []; // Ensure comments is an array

		if (storedPost) {
			this.checkedComments = comments.map((comment) =>
				storedPost.comments!.includes(comment)
			);
		} else {
			this.checkedComments = new Array(comments.length).fill(true);
		}
	}

	// Toggle the whole post (including all comments)
	togglePost(event: Event) {
		const checkbox = event.target as HTMLInputElement;
		if (checkbox.checked) {
			this.savePostToStorage();
		} else {
			this.sessionStorageService.removeSessionStorage(`post-${this.id}`);
		}
	}

	// Toggle individual comments
	toggleComment(event: Event, index: number) {
		const checkbox = event.target as HTMLInputElement;
		this.checkedComments[index] = checkbox.checked;

		if (checkbox.checked) {
			this.savePostToStorage();
		} else {
			this.updateStoredPost();
		}
	}

	// Check if post is in storage
	selectIfInStorage() {
		return !!sessionStorage.getItem(`post-${this.id}`);
	}

	// Save or update the post in session storage
	savePostToStorage() {
		const comments = this.post.comments ?? []; // Ensure comments is an array
		const filteredComments = comments.filter((_, i) => this.checkedComments[i]);
		const postToStore = { ...this.post, comments: filteredComments };
		this.sessionStorageService.updateSessionStorage(`post-${this.id}`, postToStore);
	}

	// Update the stored post based on the selected comments
	updateStoredPost() {
		const storedPost = this.getStoredPost();
		if (storedPost) {
			const comments = this.post.comments ?? []; // Ensure comments is an array
			const filteredComments = comments.filter((_, i) => this.checkedComments[i]);
			const updatedPost = { ...storedPost, comments: filteredComments };
			this.sessionStorageService.updateSessionStorage(`post-${this.id}`, updatedPost);
		}
	}

	// Retrieve post from session storage
	getStoredPost(): Post | null {
		const storedValue = sessionStorage.getItem(`post-${this.id}`);
		return storedValue ? JSON.parse(storedValue) : null;
	}

	// Check if a specific comment is checked
	isCommentChecked(index: number): boolean {
		return this.checkedComments[index];
	}
}
