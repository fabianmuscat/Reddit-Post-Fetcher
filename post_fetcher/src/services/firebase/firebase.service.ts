import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Post } from '../../interfaces/post';
import { map, Observable, take } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FirebaseService {
	constructor(private db: AngularFireDatabase) {}

	public getPosts(
		startDate: string,
		endDate: string,
		limit: number
	): Observable<Post[]> {
		// Convert startDate and endDate to UTC timestamps
		const startUtc = Date.parse(startDate);
		const endUtc = Date.parse(endDate);

		return this.db
			.list<Post>('posts')
			.valueChanges()
			.pipe(
				map((posts: Post[]) =>
					posts
						.filter(
							(post) =>
								Date.parse(post.created_date) >= startUtc &&
								Date.parse(post.created_date) <= endUtc
						)
						.slice(0, limit)
				)
			);
	}

	public cachePosts(posts: Post[]) {
		posts.forEach((post: Post) => {
			this.db
				.list<Post>('posts', (ref) =>
					ref.orderByChild('url').equalTo(post.url)
				)
				.snapshotChanges()
				.pipe(
					take(1),
					map((actions) => actions.length === 0) // Check if no post with this URL exists
				)
				.subscribe((exists) => {
					if (exists) {
						this.db.list<Post>('posts').push(post);
					}
				});
		});
	}
}
