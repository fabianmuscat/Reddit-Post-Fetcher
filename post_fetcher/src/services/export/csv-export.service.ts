import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CsvExportService {
	constructor() {}

	exportToCsv() {
		// Get all keys from sessionStorage
		const keys = Object.keys(sessionStorage);

		// Initialize an empty array to store CSV rows
		const csvRows: string[] = ['Title,Body,Date,Comments'];

		// Iterate over keys and retrieve data from sessionStorage
		keys.forEach((key) => {
			const value = sessionStorage.getItem(key);
			if (value) {
				const item = JSON.parse(value);
				const title = item.title.replace(/"/g, '""'); // Escape double quotes
				const selftext = item.selftext.replace(/"/g, '""'); // Escape double quotes
				const created_date = item.created_date;
				const comments = item.comments;

				// Construct CSV row with properly formatted fields
				const csvRow = `"${title}","${selftext}","${created_date},${comments}"`;
				csvRows.push(csvRow);
			}
		});

		// Construct CSV content
		const csvContent = csvRows.join('\n');

		// Create Blob object and download link
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.setAttribute('download', 'export.csv');

		// Simulate click to trigger download
		document.body.appendChild(link);
		link.click();

		// Clean up
		document.body.removeChild(link);
	}
}
