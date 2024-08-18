import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private sessionStorageSubject: BehaviorSubject<any> =
    new BehaviorSubject<any>(null);

  constructor() {}

  // Method to update sessionStorage and notify subscribers
  updateSessionStorage(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
    this.sessionStorageSubject.next(data);
  }

  // Method to remove sessionStorage and notify subscribers
  removeSessionStorage(key: string) {
    sessionStorage.removeItem(key);
    this.sessionStorageSubject.next(null);
  }

  // Method to clear sessionStorage and notify subscribers
  clearSessionStorage() {
    sessionStorage.clear();
    this.sessionStorageSubject.next(null);
  }

  // Observable for components to subscribe to
  getSessionStorageObservable(): Observable<any> {
    return this.sessionStorageSubject.asObservable();
  }
}
