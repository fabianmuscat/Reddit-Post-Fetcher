import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from "../../environments/environment";
import { Post } from '../../interfaces/post';


@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private url = 'http://127.0.0.1:5000/';

	constructor(private httpClient: HttpClient) {}

	getPosts(
		subreddit: string,
		startDate?: string,
		endDate?: string,
		limit: number = 10
	): Observable<Post[]> {
		let params = `subreddit=${subreddit}`;
		if (limit) {
			params += `&limit=${limit}`;
		}

		if (startDate) {
			params += `&start_date=${startDate}`;
		}

		if (endDate) {
			params += `&end_date=${endDate}`;
		}

		return this.httpClient.get<Post[]>(this.url + 'posts?' + params, {
			responseType: 'json',
		});
	}
}
