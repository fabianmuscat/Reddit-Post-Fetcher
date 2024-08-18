export interface Post {
	title: string;
	selftext: string | null;
	url: string;
	created_date: string;
	created_utc: number;
	comments?: [];
}
