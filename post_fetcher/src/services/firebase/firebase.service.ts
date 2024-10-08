import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { map, Observable, take } from 'rxjs';

import moment from 'moment';

import { Post } from '../../interfaces/post';

@Injectable({
	providedIn: "root"
})
export class FirebaseService {
	constructor(private db: AngularFireDatabase) {}
	
	public getPosts(
		subreddit: string,
		startDate: string,
		endDate: string,
		limit: number
	): Observable<Post[]> {
	// Build the path to the posts
	const path = `posts/${subreddit}`;

	return this.db
		.list<Post>(path, ref => ref.orderByKey().startAt(startDate).endAt(endDate).limitToFirst(limit))
		.valueChanges();
	}

	public cachePosts(subreddit: string, posts: Post[]) {
		posts.forEach((post: Post) => {
			const key = moment(post.created_utc).format('YYYY-MM-DDTHH:mm:ss');
			this.db
			.list<Post>(`posts/${subreddit}`)
			.snapshotChanges()
			.subscribe((_) => {
				this.db.list<Post>(`posts/${subreddit}`).set(key, post);
			});
		});
	}
}
