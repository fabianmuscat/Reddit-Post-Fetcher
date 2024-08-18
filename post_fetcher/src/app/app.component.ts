import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostComponent } from './components/post/post.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DatePipe, NgFor } from '@angular/common';
import { Post } from '../interfaces/post';
import { ApiService } from '../services/api/api.service';
import {
	FormGroup,
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms'; // Add this line
import { FirebaseService } from '../services/firebase/firebase.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		NavbarComponent,
		PostComponent,
		NgFor,
		FormsModule,
		ReactiveFormsModule,
	], // Add this line
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	providers: [ApiService, FirebaseService],
})
export class AppComponent implements OnInit {
	dateForm: FormGroup = new FormGroup({});
	posts!: Post[];
	postCount?: number;

	lastYear: Date = new Date();
	today: Date = new Date();

	constructor(
		private apiService: ApiService,
		private firebaseService: FirebaseService,
		private formBuilder: FormBuilder
	) {}

	ngOnInit() {
		this.lastYear.setFullYear(this.lastYear.getFullYear() - 1);

		this.dateForm = this.formBuilder.group({
			startDate: [this.lastYear.toISOString().split('T')[0]],
			endDate: [this.today.toISOString().split('T')[0]],
			limit: [10],
		});

		this.searchPosts();
	}

	getPostsToExport() {
		return localStorage.length;
	}

	onSubmit() {
		this.posts = [];
		this.postCount = undefined;

		this.searchPosts();
	}

	private searchPosts() {
		const { startDate, endDate, limit } = this.dateForm.value;

		this.firebaseService
			.getPosts(startDate, endDate, limit)
			.subscribe((cachedPosts: any) => {
				if (cachedPosts.length == 0) {
					this.apiService
						.getPosts(startDate, endDate, limit)
						.subscribe((apiPosts: any) => {
							this.posts = apiPosts;
							this.postCount = apiPosts.length;
							this.firebaseService.cachePosts(apiPosts);
						});
				} else {
					this.posts = cachedPosts;
					this.postCount = cachedPosts.length;
				}
			});
	}
}
