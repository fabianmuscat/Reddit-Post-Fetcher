import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import {
	FormGroup,
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms'; // Add this line
import { FirebaseService } from '../services/firebase/firebase.service';

import { Post } from '../interfaces/post';
import { ApiService } from '../services/api/api.service';

import { NavbarComponent } from './components/navbar/navbar.component';
import { PostComponent } from './components/post/post.component';

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
		this.lastYear.setMonth(this.lastYear.getMonth() - 1);

		this.dateForm = this.formBuilder.group({
			subreddit: ['BaldursGate3'],
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
		const { subreddit, startDate, endDate, limit } = this.dateForm.value;

		this.firebaseService.getPosts(subreddit, startDate, endDate, limit)
			.subscribe((cachedPosts: any) => {
				if (cachedPosts.length > 0) {
					// Retrieve the previous search dates from sessionStorage
					let previousSubreddit = sessionStorage.getItem('subreddit');
					let strPreviousSearchStart = sessionStorage.getItem(`${subreddit}_searchStartDate`);
					let strPreviousSearchEnd = sessionStorage.getItem(`${subreddit}_searchEndDate`);
					let previousSearchStart = Date.parse(startDate);
					let previousSearchEnd = Date.parse(endDate);

					if (strPreviousSearchStart !== null && strPreviousSearchEnd !== null) {
						previousSearchStart = new Date(Number(strPreviousSearchStart)).getTime();
						previousSearchEnd = new Date(Number(strPreviousSearchEnd)).getTime();
					}

					// Retrieve the new search range
					const searchStartDate = Date.parse(startDate);
					const searchEndDate = Date.parse(endDate);
					
					// If the search range is outside the cached range, fetch new posts
					if (searchStartDate < previousSearchStart || searchEndDate > previousSearchEnd || subreddit !== previousSubreddit) {
						this.apiService
							.getPosts(subreddit, startDate, endDate, limit)
							.subscribe((apiPosts: any) => {
								this.posts = apiPosts;
								this.postCount = apiPosts.length;
								this.firebaseService.cachePosts(subreddit, apiPosts);
							});
					} else {
						// If the search range is within the cached range, use cached posts
						this.posts = cachedPosts;
						this.postCount = cachedPosts.length;
					}

					// Update the search range in sessionStorage
					sessionStorage.setItem(`${subreddit}_searchStartDate`, searchStartDate.toString());
					sessionStorage.setItem(`${subreddit}_searchEndDate`, searchEndDate.toString());
					sessionStorage.setItem('subreddit', subreddit);
				} else {
					// If there are no cached posts, fetch new posts
					this.apiService
						.getPosts(subreddit, startDate, endDate, limit)
						.subscribe((apiPosts: any) => {
							this.posts = apiPosts;
							this.postCount = apiPosts.length;
							this.firebaseService.cachePosts(subreddit, apiPosts);
						});
				}
			});
	}
}
