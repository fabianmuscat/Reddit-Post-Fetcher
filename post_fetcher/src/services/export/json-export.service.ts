import { Injectable } from '@angular/core';

import { map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class JsonExportService {
	constructor() {}

	exportToJson() {
		// Get all keys from sessionStorage
		const keys = Object.keys(sessionStorage).filter((key) => key.includes('post-'));

		// Initialize an empty array to store JSON objects
		const jsonItems: any[] = [];

		// Iterate over keys and retrieve data from sessionStorage
		keys.forEach((key) => {
			const value = sessionStorage.getItem(key);
			if (value) {
				const item = JSON.parse(value);
				
				// Prepare the JSON object with the necessary fields
				const jsonObject = {
					title: item.title,      // Original title
					selftext: item.selftext, // Original body text
					created_date: item.created_date, // Original date
					comments: item.comments // List of comments as they are
				};

				// Add the prepared JSON object to the array
				jsonItems.push(jsonObject);
			}
		});

		// Convert the array of JSON objects to a JSON string
		const jsonContent = JSON.stringify(jsonItems, null, 2); // 2 spaces indentation for readability

		// Create Blob object and download link
		const blob = new Blob([jsonContent], { type: 'application/json' });
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.setAttribute('download', 'export.json');

		// Simulate click to trigger download
		document.body.appendChild(link);
		link.click();

		// Clean up
		document.body.removeChild(link);
	}
}
