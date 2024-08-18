import { Component, Input, OnInit } from '@angular/core';
import { SessionStorageService } from '../../../services/session/session-storage.service';
import { CsvExportService } from '../../../services/export/csv-export.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  title = "Baldur's Gate 3 - Subreddit Posts";
  @Input() postsToExport!: number;
  hasPosts!: boolean;

  constructor(
    private sessionStorageService: SessionStorageService,
    private csv: CsvExportService
  ) {}

  ngOnInit() {
    // Subscribe to sessionStorage updates
    this.sessionStorageService
      .getSessionStorageObservable()
      .subscribe((data: any) => {
        // Check if there are any posts saved in sessionStorage
        this.hasPosts = !!data || sessionStorage.length != 0;
      });
  }

  clearStorage() {
    Swal.fire({
      title: 'Are you sure you want to clear you selected posts?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.sessionStorageService.clearSessionStorage();
        Swal.fire({
          title: 'Deleted!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      }
    });
  }

  exportPosts() {
    this.csv.exportToCsv();
  }
}
